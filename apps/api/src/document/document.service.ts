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

	getDocuments(): Promise<DocumentSchema[]> {
		return this.repository.documents({ orderBy: { createdAt: 'asc' } })
	}

	getDocumentById(id: string): Promise<DocumentSchema> {
		return this.repository.document({ id })
	}

	createDocument(data: CreateDocumentDto): Promise<DocumentSchema> {
		return this.repository.createDocument(data)
	}

	updateDocumentById(
		id: string,
		data: UpdateDocumentDto
	): Promise<DocumentSchema> {
		return this.repository.updateDocument({ where: { id }, data })
	}

	deleteDocumentById(id: string): Promise<DocumentSchema> {
		return this.repository.deleteDocument({ id })
	}
}
