import type { Prisma } from '@repo/database'

export const AUTH_USER_SELECT = {
	id: true,
	login: true
} satisfies Prisma.UserSelect

export const AUTHENTICATION_USER_SELECT = {
	...AUTH_USER_SELECT,
	password: true
} satisfies Prisma.UserSelect
