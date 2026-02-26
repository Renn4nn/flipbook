import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { CustomPrismaModule } from 'nestjs-prisma/dist/custom'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { DocumentModule } from './document/document.module'
import { config, validate } from './lib/config/env'
import { HttpExceptionFilter } from './lib/filters/http.exception.filter'
import { PrismaClientFactory } from './lib/utils/prisma.utils'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [config],
			validate,
			ignoreEnvFile: process.env.NODE_ENV === 'production'
		}),
		CustomPrismaModule.forRootAsync({
			name: 'PrismaService',
			isGlobal: true,
			useFactory: PrismaClientFactory,
			inject: [ConfigService]
		}),
		DocumentModule
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter
		}
	]
})
export class AppModule {}
