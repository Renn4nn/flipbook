import { Injectable } from '@nestjs/common'
import type { Prisma } from '@repo/database'
import type { UserSchema } from '@repo/schemas'
import * as bcrypt from 'bcrypt'
import type { CreateUserDto, UpdateUserDto } from '../lib/types/dto/user.dto'
import type { IUserService } from '../lib/types/interfaces/user.interface'
import { UserRepository } from './user.repository'

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
		const salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(password, salt)

		return this.repository.createUser({
			...userData,
			password: hashedPassword,
			documents: documentIds
				? { connect: documentIds.map((id) => ({ id })) }
				: undefined
		})
	}

	async updateUserById(id: string, data: UpdateUserDto): Promise<UserSchema> {
		const { documentIds, password, ...userData } = data
		let hashedPassword: string | undefined

		if (password) {
			const salt = await bcrypt.genSalt()
			hashedPassword = await bcrypt.hash(password, salt)
		}

		const updateData: Prisma.UserUpdateInput = {
			...userData,
			password: hashedPassword,
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
}
