import type { AuthResultSchema } from '@repo/schemas'

export type LoginActionState = {
	message: string | null
	fieldErrors?: Partial<Record<'login' | 'password', string[]>>
}

export type SessionTokens = {
	auth: AuthResultSchema
	refreshToken: string
	refreshMaxAge: number
}

export type AccessValidation = 'valid' | 'invalid' | 'unavailable'
