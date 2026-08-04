import { PrismaPg } from '@prisma/adapter-pg'
import { transformDatabaseUrl } from '@repo/config'
import { type Prisma, PrismaClient } from '../src/generated/prisma/client'
import { seedDocuments, seedUsers } from '../src/lib/seed/data'
import { seedDatabase } from '../src/lib/utils'

const connectionString = transformDatabaseUrl.parse(process.env)
const schema = process.env.POSTGRES_DB_SCHEMA
const adapter = new PrismaPg({ connectionString }, { schema })
const prisma = new PrismaClient({ adapter })

async function main() {
	await seedDatabase({
		prisma,
		models: {
			document: {
				data: seedDocuments,
				// sujeito a erro por conta do id
				whereCb: (item: unknown) => ({
					id: (item as Prisma.DocumentCreateInput).id
				})
			},
			user: {
				data: seedUsers,
				whereCb: (item: unknown) => ({
					id: (item as Prisma.UserCreateInput).id
				})
			}
		}
	})
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
