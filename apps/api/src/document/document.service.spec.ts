import type { SelectedDocument } from 'src/lib/selects'
import type { DocumentRepository } from './document.repository'
import { DocumentService } from './document.service'

describe('DocumentService', () => {
	let repository: jest.Mocked<DocumentRepository>
	let service: DocumentService

	const userId = '123e4567-e89b-12d3-a456-426614174000'
	const sharedUserId = '223e4567-e89b-12d3-a456-426614174000'
	const documentId = 'd2cccaf2-32d8-4707-a76d-a7e90f111ea1'
	const document: SelectedDocument = {
		id: documentId,
		filename: 'document.pdf',
		path: `/uploads/${documentId}.pdf`,
		title: 'Document',
		size: '1024',
		pages: 1,
		isPublic: false,
		ownerId: userId,
		createdAt: new Date('2026-08-06T12:00:00.000Z'),
		updatedAt: new Date('2026-08-06T12:00:00.000Z')
	}

	beforeEach(() => {
		repository = {
			document: jest.fn(),
			documents: jest.fn(),
			createDocument: jest.fn(),
			updateDocument: jest.fn(),
			deleteDocument: jest.fn(),
			documentSharing: jest.fn(),
			sharingUsers: jest.fn(),
			updateDocumentSharing: jest.fn()
		} as unknown as jest.Mocked<DocumentRepository>
		service = new DocumentService(repository)
	})

	it('lists only linked documents and identifies the owner', async () => {
		repository.documents.mockResolvedValue([document])

		const result = await service.getDocuments(userId)

		expect(repository.documents).toHaveBeenCalledWith({
			where: { users: { some: { id: userId } } },
			orderBy: { createdAt: 'asc' }
		})
		expect(result[0]).toMatchObject({ id: documentId, canManage: true })
		expect(result[0]).not.toHaveProperty('ownerId')
	})

	it('marks a linked non-owner as unable to manage', async () => {
		repository.document.mockResolvedValue(document)

		const result = await service.getDocumentById(documentId, sharedUserId)

		expect(result.canManage).toBe(false)
	})

	it('allows anonymous reads only for public documents', async () => {
		repository.document.mockResolvedValue(document)

		await service.getDocumentById(documentId)

		expect(repository.document).toHaveBeenCalledWith({
			id: documentId,
			OR: [{ isPublic: true }]
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

	it('restricts updates and deletion to the owner', async () => {
		repository.updateDocument.mockResolvedValue(document)
		repository.deleteDocument.mockResolvedValue(document)

		await service.updateDocumentById(documentId, { title: 'Updated' }, userId)
		await service.deleteDocumentById(documentId, userId)

		expect(repository.updateDocument).toHaveBeenCalledWith({
			where: { id: documentId, ownerId: userId },
			data: { title: 'Updated' }
		})
		expect(repository.deleteDocument).toHaveBeenCalledWith({
			id: documentId,
			ownerId: userId
		})
	})

	it('returns sharing options without exposing the owner as removable', async () => {
		repository.documentSharing.mockResolvedValue({
			isPublic: false,
			ownerId: userId,
			users: [{ id: userId }, { id: sharedUserId }]
		})
		repository.sharingUsers.mockResolvedValue([
			{ id: sharedUserId, login: 'reader' }
		])

		const result = await service.getDocumentSharing(documentId, userId)

		expect(repository.documentSharing).toHaveBeenCalledWith({
			id: documentId,
			ownerId: userId
		})
		expect(result).toEqual({
			isPublic: false,
			userIds: [sharedUserId],
			availableUsers: [{ id: sharedUserId, login: 'reader' }]
		})
	})

	it('updates sharing atomically and always preserves the owner', async () => {
		repository.updateDocumentSharing.mockResolvedValue()
		repository.documentSharing.mockResolvedValue({
			isPublic: true,
			ownerId: userId,
			users: [{ id: userId }, { id: sharedUserId }]
		})
		repository.sharingUsers.mockResolvedValue([
			{ id: sharedUserId, login: 'reader' }
		])

		await service.updateDocumentSharing(
			documentId,
			{ isPublic: true, userIds: [userId, sharedUserId] },
			userId
		)

		expect(repository.updateDocumentSharing).toHaveBeenCalledWith(
			{ id: documentId, ownerId: userId },
			{
				isPublic: true,
				users: { set: [{ id: userId }, { id: sharedUserId }] }
			}
		)
	})
})
