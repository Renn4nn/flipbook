import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type {
	AuthenticatedRequestUser,
	JwtPayload
} from '../../lib/types/auth/auth'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
			algorithms: ['HS256']
		})
	}

	validate(payload: JwtPayload): AuthenticatedRequestUser {
		if (payload.type !== 'access') {
			throw new UnauthorizedException('Token inválido.')
		}

		return { userId: payload.sub, login: payload.login }
	}
}
