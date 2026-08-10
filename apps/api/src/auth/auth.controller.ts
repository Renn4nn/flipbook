import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Throttle } from '@nestjs/throttler'
import { API_PREFIX } from '@repo/constants'
import type { ApiSuccessResponse } from '@repo/schemas'
import type { CookieOptions, Request, Response } from 'express'
import { THROTTLE_LIMITS } from '../lib/config/throttle/throttle.config'
import type {
	AuthenticatedRequestUser,
	AuthenticatedUser,
	AuthResult
} from '../lib/types/auth/auth'
import { SignInDto, SignUpDto } from '../lib/types/dto/auth.dto'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/JwtGuard'

interface AuthRequest extends Request {
	cookies: Record<string, string | undefined>
	user: AuthenticatedRequestUser
}

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) { }

	@Post('signup')
	@Throttle({ default: THROTTLE_LIMITS.AUTH })
	async signUp(
		@Body() dto: SignUpDto,
		@Res({ passthrough: true }) response: Response
	): Promise<ApiSuccessResponse<AuthResult>> {
		const { refreshToken, ...result } = await this.authService.signUp(dto)
		this.setRefreshCookie(response, refreshToken)

		return { data: result }
	}

	@Post('signin')
	@Throttle({ default: THROTTLE_LIMITS.AUTH })
	@HttpCode(HttpStatus.OK)
	async signIn(
		@Body() dto: SignInDto,
		@Res({ passthrough: true }) response: Response
	): Promise<ApiSuccessResponse<AuthResult>> {
		const { refreshToken, ...result } = await this.authService.signIn(dto)
		this.setRefreshCookie(response, refreshToken)

		return { data: result }
	}

	@Post('refresh')
	@Throttle({ default: THROTTLE_LIMITS.AUTH })
	@HttpCode(HttpStatus.OK)
	async refresh(
		@Req() request: AuthRequest,
		@Res({ passthrough: true }) response: Response
	): Promise<ApiSuccessResponse<AuthResult>> {
		const currentRefreshToken = request.cookies.refreshToken

		if (!currentRefreshToken) {
			throw new UnauthorizedException('Sessão expirada. Faça login novamente.')
		}

		const { refreshToken, ...result } =
			await this.authService.refresh(currentRefreshToken)
		this.setRefreshCookie(response, refreshToken)

		return { data: result }
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	getCurrentUser(
		@Req() request: AuthRequest
	): ApiSuccessResponse<AuthenticatedUser> {
		return {
			data: { id: request.user.userId, login: request.user.login }
		}
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(
		@Res({ passthrough: true }) response: Response
	): ApiSuccessResponse<{ message: string }> {
		response.clearCookie('refreshToken', this.baseCookieOptions())

		return { data: { message: 'Sessão encerrada com sucesso!' } }
	}

	private setRefreshCookie(response: Response, token: string): void {
		const maxAge =
			this.configService.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN') * 1000

		response.cookie('refreshToken', token, {
			...this.baseCookieOptions(),
			maxAge
		})
	}

	private baseCookieOptions(): CookieOptions {
		return {
			httpOnly: true,
			secure: this.configService.get('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: `${API_PREFIX}/auth`
		}
	}
}
