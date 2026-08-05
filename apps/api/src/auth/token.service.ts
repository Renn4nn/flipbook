import { randomUUID } from 'node:crypto'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { AuthTokens, JwtPayload, TokenType } from '../lib/types/auth/auth'

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async generateTokens(userId: string, login: string): Promise<AuthTokens> {
		const accessExpiresIn = this.configService.getOrThrow<number>(
			'JWT_ACCESS_EXPIRES_IN'
		)
		const refreshExpiresIn = this.configService.getOrThrow<number>(
			'JWT_REFRESH_EXPIRES_IN'
		)
		const accessSecret =
			this.configService.getOrThrow<string>('JWT_ACCESS_SECRET')
		const refreshSecret =
			this.configService.getOrThrow<string>('JWT_REFRESH_SECRET')

		const createPayload = (type: TokenType): JwtPayload => ({
			sub: userId,
			login,
			type,
			jti: randomUUID()
		})

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(createPayload('access'), {
				secret: accessSecret,
				expiresIn: accessExpiresIn
			}),
			this.jwtService.signAsync(createPayload('refresh'), {
				secret: refreshSecret,
				expiresIn: refreshExpiresIn
			})
		])

		return { accessToken, refreshToken, expiresIn: accessExpiresIn }
	}

	async verifyToken(
		token: string,
		expectedType: TokenType
	): Promise<JwtPayload> {
		try {
			const secretKey =
				expectedType === 'access' ? 'JWT_ACCESS_SECRET' : 'JWT_REFRESH_SECRET'
			const secret = this.configService.getOrThrow<string>(secretKey)
			const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
				secret,
				algorithms: ['HS256']
			})

			if (payload.type !== expectedType) {
				throw new UnauthorizedException('Tipo de token inválido.')
			}

			return payload
		} catch {
			throw new UnauthorizedException('Token inválido ou expirado.')
		}
	}
}
