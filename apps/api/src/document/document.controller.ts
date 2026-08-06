import { createReadStream, existsSync, rmSync } from 'node:fs'
import { basename, join, parse } from 'node:path'
import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Request,
	StreamableFile,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { RESOURCES } from '@repo/constants'
import { ApiSuccessResponse, DocumentSchema } from '@repo/schemas'
import { multerConfig } from 'src/lib/config/multer/multer.config'
import type { AuthenticatedRequestUser } from 'src/lib/types/auth/auth'
import {
	CreateDocumentDto,
	UpdateDocumentDto
} from 'src/lib/types/dto/document.dto'
import { JwtAuthGuard } from '../auth/guards/JwtGuard'
import { OptionalJwtAuthGuard } from '../auth/guards/OptionalJwtGuard'
import { DocumentService } from './document.service'

@Controller(RESOURCES.DOCUMENTS)
export class DocumentController {
	constructor(private readonly service: DocumentService) {}

	@Get(':id/file')
	@UseGuards(OptionalJwtAuthGuard)
	async getDocumentFile(
		@Param('id', ParseUUIDPipe) id: string,
		@Request() request: { user?: AuthenticatedRequestUser }
	): Promise<StreamableFile> {
		const document = await this.service.getDocumentById(
			id,
			request.user?.userId
		)
		const filePath = join(process.cwd(), 'uploads', basename(document.path))

		if (!existsSync(filePath)) {
			throw new NotFoundException('Arquivo do documento não encontrado.')
		}

		return new StreamableFile(createReadStream(filePath), {
			type: 'application/pdf',
			disposition: `inline; filename*=UTF-8''${encodeURIComponent(document.filename)}`,
			length: Number(document.size)
		})
	}

	@Get(':id')
	@UseGuards(OptionalJwtAuthGuard)
	async getDocumentById(
		@Param('id', ParseUUIDPipe) id: string,
		@Request() request: { user?: AuthenticatedRequestUser }
	): Promise<ApiSuccessResponse<DocumentSchema>> {
		const result = await this.service.getDocumentById(id, request.user?.userId)
		return {
			data: result
		}
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getDocuments(
		@Request() request: { user: AuthenticatedRequestUser }
	): Promise<ApiSuccessResponse<DocumentSchema[]>> {
		const result = await this.service.getDocuments(request.user.userId)
		return {
			data: result
		}
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	// ZodResponse({ type: DocumentDto }) This feature is currently disabled due to issues with SwaggerApi and Zod integration
	@UseInterceptors(FileInterceptor('file', multerConfig))
	async createDocument(
		@Body() documentData: CreateDocumentDto,
		@UploadedFile() _file: Express.Multer.File,
		@Request() request: { user: AuthenticatedRequestUser }
	): Promise<ApiSuccessResponse<DocumentSchema>> {
		const documentId = parse(_file.filename).name
		const result = await this.service.createDocument(
			{
				...documentData,
				id: documentId,
				filename: _file.originalname,
				path: `/uploads/${_file.filename}`
			},
			request.user.userId
		)

		return {
			data: result
		}
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	// ZodResponse({ type: DocumentDto }) This feature is currently disabled due to issues with SwaggerApi and Zod integration
	async updateDocument(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() data: UpdateDocumentDto,
		@Request() request: { user: AuthenticatedRequestUser }
	): Promise<ApiSuccessResponse<DocumentSchema>> {
		const result = await this.service.updateDocumentById(
			id,
			data,
			request.user.userId
		)
		return {
			data: result
		}
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async deleteDocument(
		@Param('id', ParseUUIDPipe) id: string,
		@Request() request: { user: AuthenticatedRequestUser }
	): Promise<ApiSuccessResponse<DocumentSchema>> {
		const result = await this.service.deleteDocumentById(
			id,
			request.user.userId
		)

		if (result.path) {
			try {
				const filename = basename(result.path)
				const filePath = join(process.cwd(), 'uploads', filename)
				rmSync(filePath, { force: true })
			} catch (error) {
				console.error('Failed to delete file:', error)
			}
		}
		return {
			data: result
		}
	}
}
