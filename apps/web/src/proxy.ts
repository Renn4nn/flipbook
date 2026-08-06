import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requestTokenRefresh, validateAccessToken } from '@/lib/auth/backend'
import {
	ACCESS_TOKEN_COOKIE,
	REFRESH_TOKEN_COOKIE,
	SESSION_COOKIE_OPTIONS
} from '@/lib/auth/config'
import type { SessionTokens } from '@/lib/auth/types'

function isPrivateRoute(pathname: string): boolean {
	return pathname === '/library' || pathname.startsWith('/library/')
}

export default async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const privateRoute = isPrivateRoute(pathname)
	const loginRoute = pathname === '/login'
	const publicDocumentRoute = pathname.startsWith('/view/')

	if (!privateRoute && !loginRoute && !publicDocumentRoute) {
		return NextResponse.next()
	}

	const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
	const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value

	if (accessToken) {
		const validation = await validateAccessToken(accessToken)

		if (validation === 'valid') {
			return loginRoute
				? NextResponse.redirect(new URL('/library', request.url))
				: NextResponse.next()
		}

		if (validation === 'unavailable') return NextResponse.next()
	}

	if (refreshToken) {
		const session = await requestTokenRefresh(refreshToken)
		if (session) {
			const destination = loginRoute ? '/library' : request.nextUrl
			const response = NextResponse.redirect(new URL(destination, request.url))
			setSessionCookies(response, session)
			return response
		}
	}

	const response = privateRoute
		? NextResponse.redirect(new URL('/login', request.url))
		: NextResponse.next()
	clearSessionCookies(response)
	return response
}

function setSessionCookies(
	response: NextResponse,
	session: SessionTokens
): void {
	response.cookies.set(ACCESS_TOKEN_COOKIE, session.auth.accessToken, {
		...SESSION_COOKIE_OPTIONS,
		maxAge: session.auth.expiresIn
	})
	response.cookies.set(REFRESH_TOKEN_COOKIE, session.refreshToken, {
		...SESSION_COOKIE_OPTIONS,
		maxAge: session.refreshMaxAge
	})
}

function clearSessionCookies(response: NextResponse): void {
	response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
		...SESSION_COOKIE_OPTIONS,
		maxAge: 0
	})
	response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
		...SESSION_COOKIE_OPTIONS,
		maxAge: 0
	})
}

export const config = {
	matcher: ['/login', '/library/:path*', '/view/:path*']
}
