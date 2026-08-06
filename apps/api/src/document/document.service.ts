import { Injectable } from '@nestjs/common'
import type { DocumentSchema, DocumentSharingSchema } from '@repo/schemas'
import type { SelectedDocument } from 'src/lib/selects'
import {
	CreateDocumentDto,
	UpdateDocumentDto,
	UpdateDocumentSharingDto
} from 'src/lib/types/dto/document.dto'
import type { IDocumentService } from 'src/lib/types/interfaces/document.inteface'
import { DocumentRepository } from './document.repository'

@Injectable()
export class DocumentService implements IDocumentService {
	constructor(private repository: DocumentRepository) {}

	async getDocuments(userId: string): Promise<DocumentSchema[]> {
		const documents = await this.repository.documents({
			where: { users: { some: { id: userId } } },
			orderBy: { createdAt: 'asc' }
		})
		return documents.map((document) => this.toDocument(document, userId))
	}

	async getDocumentById(id: string, userId?: string): Promise<DocumentSchema> {
		const document = await this.repository.document({
			id,
			OR: [
				{ isPublic: true },
				...(userId ? [{ users: { some: { id: userId } } }] : [])
			]
		})
		return this.toDocument(document, userId)
	}

	createDocument(
		data: CreateDocumentDto,
		userId: string
	): Promise<DocumentSchema> {
		return this.repository
			.createDocument({
				...data,
				owner: { connect: { id: userId } },
				users: { connect: { id: userId } }
			})
			.then((document) => this.toDocument(document, userId))
	}

	updateDocumentById(
		id: string,
		data: UpdateDocumentDto,
		userId: string
	): Promise<DocumentSchema> {
		return this.repository
			.updateDocument({ where: { id, ownerId: userId }, data })
			.then((document) => this.toDocument(document, userId))
	}

	deleteDocumentById(id: string, userId: string): Promise<DocumentSchema> {
		return this.repository
			.deleteDocument({ id, ownerId: userId })
			.then((document) => this.toDocument(document, userId))
	}

	async getDocumentSharing(
		id: string,
		userId: string
	): Promise<DocumentSharingSchema> {
		const sharing = await this.repository.documentSharing({
			id,
			ownerId: userId
		})
		const availableUsers = await this.repository.sharingUsers(sharing.ownerId)

		return {
			isPublic: sharing.isPublic,
			userIds: sharing.users
				.map((user) => user.id)
				.filter((id) => id !== sharing.ownerId),
			availableUsers
		}
	}

	async updateDocumentSharing(
		id: string,
		data: UpdateDocumentSharingDto,
		userId: string
	): Promise<DocumentSharingSchema> {
		await this.repository.updateDocumentSharing(
			{ id, ownerId: userId },
			{
				isPublic: data.isPublic,
				users: {
					set: [
						{ id: userId },
						...data.userIds
							.filter((sharedUserId) => sharedUserId !== userId)
							.map((sharedUserId) => ({ id: sharedUserId }))
					]
				}
			}
		)

		return this.getDocumentSharing(id, userId)
	}

	private toDocument(
		document: SelectedDocument,
		userId?: string
	): DocumentSchema {
		const { ownerId, ...publicDocument } = document
		return { ...publicDocument, canManage: ownerId === userId }
	}
}
