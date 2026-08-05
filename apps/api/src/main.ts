// biome-ignore-all lint/correctness/useHookAtTopLevel: Conflict

import { join } from 'node:path'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import {
	DocumentBuilder,
	SwaggerCustomOptions,
	SwaggerModule
} from '@nestjs/swagger'
import { API_PREFIX } from '@repo/constants'
import cookieParser from 'cookie-parser'
import { cleanupOpenApiDoc } from 'nestjs-zod'
import { AppModule } from './app.module'
import {
	PrismaClientExceptionFilter,
	ZodSerializationExceptionFilter,
	ZodValidationExceptionFilter
} from './lib/filters'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	app.useStaticAssets(join(__dirname, '..', 'public'))
	app.setGlobalPrefix(API_PREFIX.slice(1))

	const { httpAdapter } = app.get(HttpAdapterHost)
	const configService = app.get(ConfigService)
	const PORT = configService.getOrThrow('API_PORT')
	app.use(cookieParser())
	app.enableCors({
		origin: configService.getOrThrow('WEB_ORIGIN'),
		credentials: true
	})

	const config = new DocumentBuilder()
		.setTitle('CTD FlipBook API')
		.setDescription('Documentação da API da aplicação CTD FlipBook')
		.setVersion('1.0')
		.build()

	const openApiDoc = SwaggerModule.createDocument(app, config)

	app.use(`${API_PREFIX}/docs`, (_request, response, next) => {
		response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
		next()
	})

	const customOptions: SwaggerCustomOptions = {
		jsonDocumentUrl: `${API_PREFIX}/docs/json`,
		swaggerOptions: {
			url: `${API_PREFIX}/docs/json`
		},
		customSiteTitle: 'CTD Resource - Docs',
		customfavIcon: '/favicon.ico',
		customCss: `
		.topbar-wrapper .link svg {
				display: none;
			}
		.topbar-wrapper .link::after {
				content: "";
				background-image: url('/ctdLogo.svg');
				background-repeat: no-repeat;
    			background-position: center left;
    			background-size: contain;
				width: 250px;
    			height: 50px;
			}
		`
	}

	SwaggerModule.setup(
		`${API_PREFIX.slice(1)}/docs`,
		app,
		cleanupOpenApiDoc(openApiDoc),
		customOptions
	)

	app.useGlobalFilters(new ZodValidationExceptionFilter())
	app.useGlobalFilters(new ZodSerializationExceptionFilter())
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
	await app.listen(PORT)
	console.info(`Running on port ${PORT}`)
}
bootstrap()
