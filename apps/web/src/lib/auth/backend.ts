import 'server-only'

import { AUTH_ROUTES } from '@repo/constants'
import type { ApiResponse, AuthResultSchema } from '@repo/schemas'
import { API_BASE_URL } from './config'
import type { AccessValidation, SessionTokens } from './types'

const DEFAULT_REFRESH_MAX_AGE = 60 * 60 * 24 * 7

export async function authenticate(
	login: string,
	password: string
): Promise<
	| { success: true; session: SessionTokens }
	| { success: false; message: string }
> {
	try {
		const response = await fetch(`${API_BASE_URL}${AUTH_ROUTES.SIGN_IN}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login, password }),
			cache: 'no-store'
		})
		const body = (await response.json()) as ApiResponse<AuthResultSchema>

		if (!response.ok || !('data' in body)) {
			return { success: false, message: getErrorMessage(body) }
		}

		const refreshCookie = parseRefreshCookie(response.headers.get('set-cookie'))
		if (!refreshCookie) {
			return {
				success: false,
				message: 'A API não iniciou a sessão corretamente.'
			}
		}

		return {
			success: true,
			session: {
				auth: body.data,
				refreshToken: refreshCookie.value,
				refreshMaxAge: refreshCookie.maxAge
			}
		}
	} catch {
		return {
			success: false,
			message: 'Não foi possível comunicar com a API.'
		}
	}
}

export async function validateAccessToken(
	accessToken: string
): Promise<AccessValidation> {
	try {
		const response = await fetch(`${API_BASE_URL}${AUTH_ROUTES.ME}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			cache: 'no-store'
		})

		if (response.ok) return 'valid'
		if (response.status === 401) return 'invalid'
		return 'unavailable'
	} catch {
		return 'unavailable'
	}
}

export async function requestTokenRefresh(
	refreshToken: string
): Promise<SessionTokens | null> {
	try {
		const response = await fetch(`${API_BASE_URL}${AUTH_ROUTES.REFRESH}`, {
			method: 'POST',
			headers: { Cookie: `refreshToken=${encodeURIComponent(refreshToken)}` },
			cache: 'no-store'
		})

		if (!response.ok) return null

		const body = (await response.json()) as ApiResponse<AuthResultSchema>
		if (!('data' in body)) return null

		const refreshCookie = parseRefreshCookie(response.headers.get('set-cookie'))
		if (!refreshCookie) return null

		return {
			auth: body.data,
			refreshToken: refreshCookie.value,
			refreshMaxAge: refreshCookie.maxAge
		}
	} catch {
		return null
	}
}

export async function notifyBackendLogout(
	refreshToken?: string
): Promise<void> {
	try {
		await fetch(`${API_BASE_URL}${AUTH_ROUTES.LOGOUT}`, {
			method: 'POST',
			headers: refreshToken
				? { Cookie: `refreshToken=${encodeURIComponent(refreshToken)}` }
				: undefined,
			cache: 'no-store'
		})
	} catch {
		// The local session must still be removed when the API is unavailable.
	}
}

function parseRefreshCookie(
	setCookieHeader: string | null
): { value: string; maxAge: number } | null {
	if (!setCookieHeader) return null

	const valueMatch = setCookieHeader.match(/(?:^|,\s*)refreshToken=([^;]+)/i)
	if (!valueMatch?.[1]) return null

	const maxAgeMatch = setCookieHeader.match(/Max-Age=(\d+)/i)

	return {
		value: decodeURIComponent(valueMatch[1]),
		maxAge: maxAgeMatch?.[1] ? Number(maxAgeMatch[1]) : DEFAULT_REFRESH_MAX_AGE
	}
}

function getErrorMessage(response: ApiResponse<AuthResultSchema>): string {
	if ('error' in response) return response.error.message
	if ('errors' in response) {
		return response.errors[0]?.message ?? 'Não foi possível entrar.'
	}
	return 'Não foi possível entrar.'
}
