import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Request,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { RESOURCES } from '@repo/constants'
import { ApiSuccessResponse, DocumentSchema } from '@repo/schemas'
import { multerConfig } from 'src/lib/config/multer/multer.config'
import {
	CreateDocumentDto,
	UpdateDocumentDto
} from 'src/lib/types/dto/document.dto'
import { DocumentService } from './document.service'
import * as path from "path";
import * as fs from "fs";

@Controller(RESOURCES.DOCUMENTS)
export class DocumentController {
	constructor(private readonly service: DocumentService) { }

	@Get(':id')
	async getDocumentById(
		@Param('id', ParseUUIDPipe) id: string
	): Promise<ApiSuccessResponse<DocumentSchema>> {
		const result = await this.service.getDocumentById(id)
		return {
			data: result
		}
	}

	@Get()
	async getDocuments(): Promise<ApiSuccessResponse<DocumentSchema[]>> {
		const result = await this.service.getDocuments()
		return {
			data: result
		}
	}

	@Post()
	// ZodResponse({ type: DocumentDto }) This feature is currently disabled due to issues with SwaggerApi and Zod integration
	@UseInterceptors(FileInterceptor('file', multerConfig))
	async createDocument(
		@Body() documentData: CreateDocumentDto,
		@UploadedFile() _file: Express.Multer.File,
		@Request() _req: unknown
	): Promise<ApiSuccessResponse<DocumentSchema>> {
		const documentId = _file.filename
		console.log(_file)
		const result = await this.service.createDocument({
			...documentData,
			id: documentId.split('.pdf')[0],
			filename: _file.originalname,
			path: `/uploads/${_file.filename}`
		})

		return {
			data: result
		}
	}

	@Patch(':id')
	// ZodResponse({ type: DocumentDto }) This feature is currently disabled due to issues with SwaggerApi and Zod integration
	async updateDocument(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() data: UpdateDocumentDto
	): Promise<ApiSuccessResponse<DocumentSchema>> {
		const result = await this.service.updateDocumentById(id, data)
		return {
			data: result
		}
	}

	@Delete(':id')
	async deleteDocument(
		@Param('id', ParseUUIDPipe) id: string
	): Promise<ApiSuccessResponse<DocumentSchema>> {
		const result = await this.service.deleteDocumentById(id)

		if (result.path) {
			try {
				const filename = path.basename(result.path);
				const filePath = path.join(process.cwd(), 'uploads', filename)
				fs.unlinkSync(filePath)
			} catch (error) {
				console.log("Failed to delete file:", error)
			}
		}
		return {
			data: result
		}
	}
}
