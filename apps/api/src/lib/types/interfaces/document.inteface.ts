import type { Prisma } from '@repo/database'
import type { ApiSuccessResponse, DocumentSchema } from '@repo/schemas'
import type { CreateDocumentDto, UpdateDocumentDto } from '../dto/document.dto'

export type GetDocumentsParams = {
	skip?: number
	take?: number
	cursor?: Prisma.DocumentWhereUniqueInput
	where?: Prisma.DocumentWhereInput
	orderBy?: Prisma.DocumentOrderByWithRelationInput
}

export type UpdateDocumentParams = {
	where: Prisma.DocumentWhereUniqueInput
	data: Prisma.DocumentUpdateInput
}

export interface IDocumentRepository {
	document(where: Prisma.DocumentWhereInput): Promise<DocumentSchema>
	documents(params: GetDocumentsParams): Promise<DocumentSchema[]>
	createDocument(data: Prisma.DocumentCreateInput): Promise<DocumentSchema>
	updateDocument(params: UpdateDocumentParams): Promise<DocumentSchema>
	deleteDocument(
		where: Prisma.DocumentWhereUniqueInput
	): Promise<DocumentSchema>
}

export interface IDocumentService {
	getDocuments(userId: string): Promise<DocumentSchema[]>
	getDocumentById(id: string, userId?: string): Promise<DocumentSchema>
	createDocument(
		data: CreateDocumentDto,
		userId: string
	): Promise<DocumentSchema>
	updateDocumentById(
		id: string,
		data: UpdateDocumentDto,
		userId: string
	): Promise<DocumentSchema>
	deleteDocumentById(id: string, userId: string): Promise<DocumentSchema>
}

export interface IDocumentController {
	getDocuments(): Promise<ApiSuccessResponse<DocumentSchema[]>>
	createDocument(
		data: CreateDocumentDto
	): Promise<ApiSuccessResponse<DocumentSchema>>
	getDocumentById(id: string): Promise<ApiSuccessResponse<DocumentSchema>>
	updateDocument(
		id: string,
		data: UpdateDocumentDto
	): Promise<ApiSuccessResponse<DocumentSchema>>
	deleteDocument(id: string): Promise<ApiSuccessResponse<DocumentSchema>>
}
