import { PrismaPg } from '@prisma/adapter-pg'
import { transformDatabaseUrl } from '@repo/config'
import { PrismaClient } from '../src/generated/prisma/client'
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
			// biome-ignore-start lint/suspicious/noExplicitAny: Required
			document: {
				data: seedDocuments,
				// sujeito a erro por conta do id
				whereCb: (item: any) => ({ id: item.id })
			},
			// biome-ignore-end lint/suspicious/noExplicitAny: Required
			user: {
				data: seedUsers,
				whereCb: (item: any) => ({ id: item.id })
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
