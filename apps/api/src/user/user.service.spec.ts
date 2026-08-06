import type { UserSchema } from '@repo/schemas'
import type { UserRepository } from './user.repository'
import { UserService } from './user.service'

describe('UserService', () => {
	let repository: jest.Mocked<UserRepository>
	let service: UserService

	const user: UserSchema = {
		id: 'd6e6fa16-78b0-4bbc-9ae4-66f46f67ea8f',
		login: 'user',
		createdAt: new Date('2026-08-04T12:00:00.000Z'),
		updatedAt: new Date('2026-08-04T12:00:00.000Z')
	}

	beforeEach(() => {
		repository = {
			user: jest.fn(),
			users: jest.fn(),
			createUser: jest.fn(),
			updateUser: jest.fn(),
			deleteUser: jest.fn()
		} as unknown as jest.Mocked<UserRepository>
		service = new UserService(repository)
	})

	it('hashes the password when creating a user', async () => {
		repository.createUser.mockResolvedValue(user)

		await service.createUser({
			login: user.login,
			password: 'password123'
		})

		expect(repository.createUser).toHaveBeenCalledWith({
			login: user.login,
			password: expect.stringMatching(/^\$2[aby]\$\d{2}\$.{53}$/)
		})
	})

	it('updates scalar user data without changing document relations', async () => {
		repository.updateUser.mockResolvedValue(user)

		await service.updateUserById(user.id, { login: 'new-user' })

		expect(repository.updateUser).toHaveBeenCalledWith({
			where: { id: user.id },
			data: {
				login: 'new-user',
				password: undefined
			}
		})
	})
})
