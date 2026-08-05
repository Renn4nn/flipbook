import type { AuthenticatedUserSchema, AuthResultSchema } from '@repo/schemas'

export type TokenType = 'access' | 'refresh'

export type JwtPayload = {
	sub: string
	login: string
	type: TokenType
	jti: string
}

export type AuthenticatedUser = AuthenticatedUserSchema

export type AuthenticatedRequestUser = {
	userId: string
	login: string
}

export type AuthTokens = {
	accessToken: string
	refreshToken: string
	expiresIn: number
}

export type AuthResult = AuthResultSchema
