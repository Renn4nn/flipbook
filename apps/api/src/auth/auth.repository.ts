import { Inject, Injectable } from '@nestjs/common'
import type { Prisma } from '@repo/database'
import type { CustomPrismaClient } from '../lib/extensions/prisma.extension'
import { AUTH_USER_SELECT, AUTHENTICATION_USER_SELECT } from '../lib/selects'

@Injectable()
export class AuthRepository {
	constructor(
		@Inject('PrismaService')
		private readonly prisma: CustomPrismaClient
	) {}

	findByLogin(login: string) {
		return this.prisma.client.user.findUnique({
			where: { login },
			select: AUTHENTICATION_USER_SELECT
		})
	}

	findById(id: string) {
		return this.prisma.client.user.findUnique({
			where: { id },
			select: AUTH_USER_SELECT
		})
	}

	createUser(data: Pick<Prisma.UserCreateInput, 'login' | 'password'>) {
		return this.prisma.client.user.create({
			data,
			select: AUTH_USER_SELECT
		})
	}
}
