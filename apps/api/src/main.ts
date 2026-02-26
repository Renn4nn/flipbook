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

	const { httpAdapter } = app.get(HttpAdapterHost)
	const PORT = app.get(ConfigService).getOrThrow('API_PORT')

	const config = new DocumentBuilder()
		.setTitle('CTD Resource API')
		.setDescription('Documentação da API da aplicação CTD Resource')
		.setVersion('1.0')
		.build()

	const openApiDoc = SwaggerModule.createDocument(app, config)

	const customOptions: SwaggerCustomOptions = {
		jsonDocumentUrl: 'api/json',
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

	SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc), customOptions)

	app.useGlobalFilters(new ZodValidationExceptionFilter())
	app.useGlobalFilters(new ZodSerializationExceptionFilter())
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

	await app.listen(PORT)
	console.info(`Running on port ${PORT}`)
}
bootstrap()
