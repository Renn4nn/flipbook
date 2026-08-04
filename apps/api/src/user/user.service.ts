import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@repo/database'
import type { UserSchema } from '@repo/schemas'
import type { CreateUserDto, UpdateUserDto } from '../lib/types/dto/user.dto'
import type { IUserService } from '../lib/types/interfaces/user.interface'
import { UserRepository } from './user.repository'

const scryptAsync = promisify(scrypt)

@Injectable()
export class UserService implements IUserService {
	constructor(private readonly repository: UserRepository) {}

	getUsers(): Promise<UserSchema[]> {
		return this.repository.users({ orderBy: { createdAt: 'asc' } })
	}

	getUserById(id: string): Promise<UserSchema> {
		return this.repository.user({ id })
	}

	async createUser(data: CreateUserDto): Promise<UserSchema> {
		const { documentIds, password, ...userData } = data

		return this.repository.createUser({
			...userData,
			password: await this.hashPassword(password),
			documents: documentIds
				? { connect: documentIds.map((id) => ({ id })) }
				: undefined
		})
	}

	async updateUserById(id: string, data: UpdateUserDto): Promise<UserSchema> {
		const { documentIds, password, ...userData } = data
		const updateData: Prisma.UserUpdateInput = {
			...userData,
			password: password ? await this.hashPassword(password) : undefined,
			documents:
				documentIds !== undefined
					? { set: documentIds.map((documentId) => ({ id: documentId })) }
					: undefined
		}

		return this.repository.updateUser({ where: { id }, data: updateData })
	}

	deleteUserById(id: string): Promise<UserSchema> {
		return this.repository.deleteUser({ id })
	}

	private async hashPassword(password: string): Promise<string> {
		const salt = randomBytes(16).toString('hex')
		const hash = (await scryptAsync(password, salt, 64)) as Buffer

		return `scrypt:${salt}:${hash.toString('hex')}`
	}
}
