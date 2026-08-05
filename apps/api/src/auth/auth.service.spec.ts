import { ConflictException, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import type { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import type { TokenService } from './token.service'

describe('AuthService', () => {
	let repository: jest.Mocked<AuthRepository>
	let tokenService: jest.Mocked<TokenService>
	let service: AuthService

	const tokens = {
		accessToken: 'access-token',
		refreshToken: 'refresh-token',
		expiresIn: 900
	}

	beforeEach(() => {
		repository = {
			findByLogin: jest.fn(),
			findById: jest.fn(),
			createUser: jest.fn()
		} as unknown as jest.Mocked<AuthRepository>
		tokenService = {
			generateTokens: jest.fn().mockResolvedValue(tokens),
			verifyToken: jest.fn()
		} as unknown as jest.Mocked<TokenService>
		service = new AuthService(repository, tokenService)
	})

	it('signs up with login, hashes the password and emits tokens', async () => {
		repository.findByLogin.mockResolvedValue(null)
		repository.createUser.mockResolvedValue({ id: 'user-id', login: 'john' })

		const result = await service.signUp({
			login: 'john',
			password: 'password123',
			confirmPassword: 'password123'
		})

		expect(repository.createUser).toHaveBeenCalledWith({
			login: 'john',
			password: expect.stringMatching(/^\$2[aby]\$\d{2}\$.{53}$/)
		})
		expect(tokenService.generateTokens).toHaveBeenCalledWith('user-id', 'john')
		expect(result).toEqual({
			user: { id: 'user-id', login: 'john' },
			...tokens
		})
	})

	it('rejects a duplicated login on signup', async () => {
		repository.findByLogin.mockResolvedValue({
			id: 'user-id',
			login: 'john',
			password: 'hash'
		})

		await expect(
			service.signUp({
				login: 'john',
				password: 'password123',
				confirmPassword: 'password123'
			})
		).rejects.toBeInstanceOf(ConflictException)
	})

	it('signs in with a valid bcrypt password', async () => {
		const salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash('password123', salt)
		repository.findByLogin.mockResolvedValue({
			id: 'user-id',
			login: 'john',
			password: hashedPassword
		})

		const result = await service.signIn({
			login: 'john',
			password: 'password123'
		})

		expect(result).toMatchObject({
			user: { id: 'user-id', login: 'john' },
			accessToken: 'access-token'
		})
		expect(result.user).not.toHaveProperty('password')
	})

	it('rejects invalid credentials without revealing the cause', async () => {
		repository.findByLogin.mockResolvedValue(null)

		await expect(
			service.signIn({ login: 'john', password: 'wrong-password' })
		).rejects.toBeInstanceOf(UnauthorizedException)
	})
})
