import 'server-only'

import { cookies } from 'next/headers'
import { requestTokenRefresh } from './backend'
import {
	ACCESS_TOKEN_COOKIE,
	REFRESH_TOKEN_COOKIE,
	SESSION_COOKIE_OPTIONS
} from './config'
import type { SessionTokens } from './types'

export async function establishSession(session: SessionTokens): Promise<void> {
	const cookieStore = await cookies()

	cookieStore.set(ACCESS_TOKEN_COOKIE, session.auth.accessToken, {
		...SESSION_COOKIE_OPTIONS,
		maxAge: session.auth.expiresIn
	})
	cookieStore.set(REFRESH_TOKEN_COOKIE, session.refreshToken, {
		...SESSION_COOKIE_OPTIONS,
		maxAge: session.refreshMaxAge
	})
}

export async function getAccessToken(): Promise<string | undefined> {
	return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value
}

export async function getRefreshToken(): Promise<string | undefined> {
	return (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value
}

export async function renewSession(): Promise<string | null> {
	const refreshToken = await getRefreshToken()
	if (!refreshToken) return null

	const session = await requestTokenRefresh(refreshToken)
	if (!session) {
		await destroySession()
		return null
	}

	await establishSession(session)
	return session.auth.accessToken
}

export async function destroySession(): Promise<void> {
	const cookieStore = await cookies()
	cookieStore.delete(ACCESS_TOKEN_COOKIE)
	cookieStore.delete(REFRESH_TOKEN_COOKIE)
}
