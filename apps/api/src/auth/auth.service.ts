import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import type { AuthResult } from '../lib/types/auth/auth'
import type { SignInDto, SignUpDto } from '../lib/types/dto/auth.dto'
import { AuthRepository } from './auth.repository'
import { TokenService } from './token.service'

type AuthResultWithRefreshToken = AuthResult & { refreshToken: string }

@Injectable()
export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly tokenService: TokenService
	) {}

	async signUp(data: SignUpDto): Promise<AuthResultWithRefreshToken> {
		const userExists = await this.authRepository.findByLogin(data.login)
		if (userExists) {
			throw new ConflictException('Este login já está cadastrado!')
		}
		const salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(data.password, salt)

		const user = await this.authRepository.createUser({
			login: data.login,
			password: hashedPassword
		})

		return this.createAuthResult(user)
	}

	async signIn(data: SignInDto): Promise<AuthResultWithRefreshToken> {
		const user = await this.authRepository.findByLogin(data.login)

		if (!user || !(await bcrypt.compare(data.password, user.password))) {
			throw new UnauthorizedException('Credenciais inválidas!')
		}

		return this.createAuthResult(user)
	}

	async refresh(refreshToken: string): Promise<AuthResultWithRefreshToken> {
		const payload = await this.tokenService.verifyToken(refreshToken, 'refresh')
		const user = await this.authRepository.findById(payload.sub)

		if (!user) {
			throw new UnauthorizedException('Usuário não encontrado.')
		}

		return this.createAuthResult(user)
	}

	private async createAuthResult(user: {
		id: string
		login: string
	}): Promise<AuthResultWithRefreshToken> {
		const tokens = await this.tokenService.generateTokens(user.id, user.login)

		return {
			user: {
				id: user.id,
				login: user.login
			},
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			expiresIn: tokens.expiresIn
		}
	}
}
