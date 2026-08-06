import { Inject, Injectable } from '@nestjs/common'
import type { Prisma } from '@repo/database'
import type { CustomPrismaClient } from 'src/lib/extensions/prisma.extension'
import type {
	GetDocumentsParams,
	IDocumentRepository,
	UpdateDocumentParams
} from 'src/lib/types/interfaces/document.inteface'
import { DOCUMENT_SELECT } from '../lib/selects'

@Injectable()
export class DocumentRepository implements IDocumentRepository {
	constructor(
		@Inject('PrismaService')
		private readonly prisma: CustomPrismaClient
	) {}

	document(where: Prisma.DocumentWhereInput) {
		return this.prisma.client.document.findFirstOrThrow({
			where,
			select: DOCUMENT_SELECT
		})
	}

	documents(params: GetDocumentsParams) {
		return this.prisma.client.document.findMany({
			...params,
			select: DOCUMENT_SELECT
		})
	}

	createDocument(data: Prisma.DocumentCreateInput) {
		return this.prisma.client.document.create({
			data,
			select: DOCUMENT_SELECT
		})
	}

	updateDocument(params: UpdateDocumentParams) {
		return this.prisma.client.document.update({
			...params,
			select: DOCUMENT_SELECT
		})
	}

	deleteDocument(where: Prisma.DocumentWhereUniqueInput) {
		return this.prisma.client.document.delete({
			where,
			select: DOCUMENT_SELECT
		})
	}

	documentSharing(where: Prisma.DocumentWhereInput) {
		return this.prisma.client.document.findFirstOrThrow({
			where,
			select: {
				isPublic: true,
				ownerId: true,
				users: { select: { id: true } }
			}
		})
	}

	sharingUsers(ownerId: string) {
		return this.prisma.client.user.findMany({
			where: { id: { not: ownerId } },
			select: { id: true, login: true },
			orderBy: { login: 'asc' }
		})
	}

	async updateDocumentSharing(
		where: Prisma.DocumentWhereUniqueInput,
		data: Prisma.DocumentUpdateInput
	): Promise<void> {
		await this.prisma.client.document.update({
			where,
			data,
			select: { id: true }
		})
	}
}
