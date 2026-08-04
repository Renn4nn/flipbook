import type { UserSchema } from '@repo/schemas'
import type { UserRepository } from './user.repository'
import { UserService } from './user.service'

describe('UserService', () => {
	let repository: jest.Mocked<UserRepository>
	let service: UserService

	const user: UserSchema = {
		id: 'd6e6fa16-78b0-4bbc-9ae4-66f46f67ea8f',
		email: 'user@example.com',
		createdAt: new Date('2026-08-04T12:00:00.000Z'),
		updatedAt: new Date('2026-08-04T12:00:00.000Z'),
		documents: []
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

	it('hashes the password and connects documents when creating a user', async () => {
		const documentId = '5edb42c7-9913-47ec-83df-5e73949f2eec'
		repository.createUser.mockResolvedValue(user)

		await service.createUser({
			email: user.email,
			password: 'password123',
			documentIds: [documentId]
		})

		expect(repository.createUser).toHaveBeenCalledWith({
			email: user.email,
			password: expect.stringMatching(/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/),
			documents: { connect: [{ id: documentId }] }
		})
	})

	it('clears all document relations when documentIds is empty', async () => {
		repository.updateUser.mockResolvedValue(user)

		await service.updateUserById(user.id, { documentIds: [] })

		expect(repository.updateUser).toHaveBeenCalledWith({
			where: { id: user.id },
			data: {
				password: undefined,
				documents: { set: [] }
			}
		})
	})

	it('keeps document relations unchanged when documentIds is omitted', async () => {
		repository.updateUser.mockResolvedValue(user)

		await service.updateUserById(user.id, { email: 'new@example.com' })

		expect(repository.updateUser).toHaveBeenCalledWith({
			where: { id: user.id },
			data: {
				email: 'new@example.com',
				password: undefined,
				documents: undefined
			}
		})
	})
})
