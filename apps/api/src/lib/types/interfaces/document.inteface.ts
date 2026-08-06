import type { Prisma } from '@repo/database'
import type {
	ApiSuccessResponse,
	DocumentSchema,
	DocumentSharingSchema
} from '@repo/schemas'
import type { SelectedDocument } from '../../selects'
import type {
	CreateDocumentDto,
	UpdateDocumentDto,
	UpdateDocumentSharingDto
} from '../dto/document.dto'

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

export type DocumentSharingRecord = {
	isPublic: boolean
	ownerId: string
	users: { id: string }[]
}

export type SharingUser = { id: string; login: string }

export interface IDocumentRepository {
	document(where: Prisma.DocumentWhereInput): Promise<SelectedDocument>
	documents(params: GetDocumentsParams): Promise<SelectedDocument[]>
	createDocument(data: Prisma.DocumentCreateInput): Promise<SelectedDocument>
	updateDocument(params: UpdateDocumentParams): Promise<SelectedDocument>
	deleteDocument(
		where: Prisma.DocumentWhereUniqueInput
	): Promise<SelectedDocument>
	documentSharing(
		where: Prisma.DocumentWhereInput
	): Promise<DocumentSharingRecord>
	sharingUsers(ownerId: string): Promise<SharingUser[]>
	updateDocumentSharing(
		where: Prisma.DocumentWhereUniqueInput,
		data: Prisma.DocumentUpdateInput
	): Promise<void>
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
	getDocumentSharing(id: string, userId: string): Promise<DocumentSharingSchema>
	updateDocumentSharing(
		id: string,
		data: UpdateDocumentSharingDto,
		userId: string
	): Promise<DocumentSharingSchema>
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
