import type { Prisma } from '../../../generated/prisma/client.js'

export const seedUsers: Prisma.UserCreateInput[] = [
	{
		id: '123e4567-e89b-12d3-a456-426614174000',
		login: 'admin',
		password: '$2b$10$z4RXeZiG7kLiZFOYoPx/B.7a5HEkQsPoyV81kLauuq32U03ZvjC3i'
	}
]
