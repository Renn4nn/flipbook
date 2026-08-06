import { Injectable } from '@nestjs/common'
import { DocumentSchema } from '@repo/schemas'
import {
	CreateDocumentDto,
	UpdateDocumentDto
} from 'src/lib/types/dto/document.dto'
import type { IDocumentService } from 'src/lib/types/interfaces/document.inteface'
import { DocumentRepository } from './document.repository'

@Injectable()
export class DocumentService implements IDocumentService {
	constructor(private repository: DocumentRepository) {}

	getDocuments(userId: string): Promise<DocumentSchema[]> {
		return this.repository.documents({
			where: { users: { some: { id: userId } } },
			orderBy: { createdAt: 'asc' }
		})
	}

	getDocumentById(id: string, userId?: string): Promise<DocumentSchema> {
		return this.repository.document({
			id,
			OR: [
				{ isPublic: true },
				...(userId ? [{ users: { some: { id: userId } } }] : [])
			]
		})
	}

	createDocument(
		data: CreateDocumentDto,
		userId: string
	): Promise<DocumentSchema> {
		return this.repository.createDocument({
			...data,
			owner: { connect: { id: userId } },
			users: { connect: { id: userId } }
		})
	}

	updateDocumentById(
		id: string,
		data: UpdateDocumentDto,
		userId: string
	): Promise<DocumentSchema> {
		return this.repository.updateDocument({
			where: { id, ownerId: userId },
			data
		})
	}

	deleteDocumentById(id: string, userId: string): Promise<DocumentSchema> {
		return this.repository.deleteDocument({ id, ownerId: userId })
	}
}
