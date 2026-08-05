export const ACCESS_TOKEN_COOKIE = 'flipbook_access_token'
export const REFRESH_TOKEN_COOKIE = 'flipbook_refresh_token'

export const SESSION_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax' as const,
	path: '/',
	priority: 'high' as const
}

export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'
