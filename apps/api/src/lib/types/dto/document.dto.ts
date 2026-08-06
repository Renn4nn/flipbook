import {
	createDocumentSchema,
	documentResponseSchema,
	updateDocumentSchema,
	updateDocumentSharingSchema
} from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class CreateDocumentDto extends createZodDto(createDocumentSchema) {}
export class UpdateDocumentDto extends createZodDto(updateDocumentSchema) {}
export class UpdateDocumentSharingDto extends createZodDto(
	updateDocumentSharingSchema
) {}
export class DocumentDto extends createZodDto(documentResponseSchema) {}
