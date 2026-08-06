import type { DocumentSchema } from '@repo/schemas'
import type { DocumentRepository } from './document.repository'
import { DocumentService } from './document.service'

describe('DocumentService', () => {
	let repository: jest.Mocked<DocumentRepository>
	let service: DocumentService

	const userId = '123e4567-e89b-12d3-a456-426614174000'
	const documentId = 'd2cccaf2-32d8-4707-a76d-a7e90f111ea1'
	const document: DocumentSchema = {
		id: documentId,
		filename: 'document.pdf',
		path: `/uploads/${documentId}.pdf`,
		title: 'Document',
		size: '1024',
		pages: 1,
		isPublic: false,
		createdAt: new Date('2026-08-06T12:00:00.000Z'),
		updatedAt: new Date('2026-08-06T12:00:00.000Z')
	}

	beforeEach(() => {
		repository = {
			document: jest.fn(),
			documents: jest.fn(),
			createDocument: jest.fn(),
			updateDocument: jest.fn(),
			deleteDocument: jest.fn()
		} as unknown as jest.Mocked<DocumentRepository>
		service = new DocumentService(repository)
	})

	it('lists only documents linked to the authenticated user', async () => {
		repository.documents.mockResolvedValue([document])

		await service.getDocuments(userId)

		expect(repository.documents).toHaveBeenCalledWith({
			where: { users: { some: { id: userId } } },
			orderBy: { createdAt: 'asc' }
		})
	})

	it('allows anonymous reads only for public documents', async () => {
		repository.document.mockResolvedValue(document)

		await service.getDocumentById(documentId)

		expect(repository.document).toHaveBeenCalledWith({
			id: documentId,
			OR: [{ isPublic: true }]
		})
	})

	it('allows authenticated reads for public or linked documents', async () => {
		repository.document.mockResolvedValue(document)

		await service.getDocumentById(documentId, userId)

		expect(repository.document).toHaveBeenCalledWith({
			id: documentId,
			OR: [{ isPublic: true }, { users: { some: { id: userId } } }]
		})
	})

	it('connects the creator as owner and authorized user', async () => {
		repository.createDocument.mockResolvedValue(document)
		const input = {
			filename: document.filename,
			path: document.path,
			title: document.title,
			size: document.size,
			pages: document.pages,
			isPublic: document.isPublic
		}

		await service.createDocument(input, userId)

		expect(repository.createDocument).toHaveBeenCalledWith({
			...input,
			owner: { connect: { id: userId } },
			users: { connect: { id: userId } }
		})
	})

	it('restricts updates to the owner', async () => {
		repository.updateDocument.mockResolvedValue(document)

		await service.updateDocumentById(documentId, { title: 'Updated' }, userId)

		expect(repository.updateDocument).toHaveBeenCalledWith({
			where: { id: documentId, ownerId: userId },
			data: { title: 'Updated' }
		})
	})

	it('restricts deletion to the owner', async () => {
		repository.deleteDocument.mockResolvedValue(document)

		await service.deleteDocumentById(documentId, userId)

		expect(repository.deleteDocument).toHaveBeenCalledWith({
			id: documentId,
			ownerId: userId
		})
	})
})
