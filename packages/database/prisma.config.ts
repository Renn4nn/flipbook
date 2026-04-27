import { transformDatabaseUrl } from '@repo/config'
import { defineConfig } from 'prisma/config'

const DATABASE_URL = process.env.POSTGRES_HOST
	? transformDatabaseUrl.parse(process.env)
	: ''

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
	},
	datasource: {
		url: DATABASE_URL
	}
})
