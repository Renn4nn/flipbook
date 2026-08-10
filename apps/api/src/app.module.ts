import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { CustomPrismaModule } from 'nestjs-prisma/dist/custom'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { AuthModule } from './auth/auth.module'
import { DocumentModule } from './document/document.module'
import { config, validate } from './lib/config/env'
import { THROTTLE_LIMITS } from './lib/config/throttle/throttle.config'
import { HttpExceptionFilter } from './lib/filters/http.exception.filter'
import { PrismaClientFactory } from './lib/utils/prisma.utils'
import { UserModule } from './user/user.module'
import { CustomThrottlerGuard } from './auth/guards/ThrottlerGuard'

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
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: THROTTLE_LIMITS.GENERAL.ttl,
					limit: THROTTLE_LIMITS.GENERAL.limit
				}
			]
		}),
		AuthModule,
		DocumentModule,
		UserModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: CustomThrottlerGuard,
		},
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
export class AppModule { }
