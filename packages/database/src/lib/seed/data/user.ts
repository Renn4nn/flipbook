import type { Prisma } from '../../../generated/prisma/client.js'

export const seedUsers: Prisma.UserCreateInput[] = [
	{
		id: '123e4567-e89b-12d3-a456-426614174000',
		email: 'admin@admin.com',
		password: 'admin12345'
	}
]
