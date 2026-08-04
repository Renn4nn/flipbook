import { Inject, Injectable } from '@nestjs/common'
import type { Prisma } from '@repo/database'
import type { CustomPrismaClient } from '../lib/extensions/prisma.extension'
import {
	type GetUsersParams,
	type IUserRepository,
	type UpdateUserParams,
	userSelect
} from '../lib/types/interfaces/user.interface'

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@Inject('PrismaService')
		private readonly prisma: CustomPrismaClient
	) {}

	user(where: Prisma.UserWhereUniqueInput) {
		return this.prisma.client.user.findUniqueOrThrow({
			where,
			select: userSelect
		})
	}

	users(params: GetUsersParams) {
		return this.prisma.client.user.findMany({
			...params,
			select: userSelect
		})
	}

	createUser(data: Prisma.UserCreateInput) {
		return this.prisma.client.user.create({
			data,
			select: userSelect
		})
	}

	updateUser(params: UpdateUserParams) {
		return this.prisma.client.user.update({
			...params,
			select: userSelect
		})
	}

	deleteUser(where: Prisma.UserWhereUniqueInput) {
		return this.prisma.client.user.delete({
			where,
			select: userSelect
		})
	}
}
