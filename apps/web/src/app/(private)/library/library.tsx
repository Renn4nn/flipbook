'use client'

import { API_ROUTES, RESOURCES } from '@repo/constants'
import type {
	ApiResponse,
	DocumentSchema,
	UpdateDocumentSchema
} from '@repo/schemas'
import { Eye, FolderOpen, Pencil, Search, Share, Trash, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { apiAction } from '@/lib/api/actions'
import useApiResponse from '@/lib/api/hooks'
import { useModalStore } from '@/lib/store/useModal'
import ModalDelete from '@/ui/components/modal/delete/ModalDelete'
import ModalEditTitle from '@/ui/components/modal/edit-title/ModalEditTitle'
import ModalShareDocument from '@/ui/components/modal/share/ModalShareDocument'
import LoadingSkeleton from '@/ui/components/skeletons/library/LoadingSkeleton/LoadingSkeleton'
import DocumentLibraryFilter, {
	type DocumentLibraryFilterValue
} from './DocumentLibraryFilter'
import styles from './library.module.css'

const ThumbnailPdf = dynamic(
	() => import('@/ui/components/thumbnail/ThumbnailPdf'),
	{
		ssr: false,
		loading: () => (
			<div className={styles.loadingContainer}>
				<LoadingSkeleton />
			</div>
		)
	}
)

export default function Library({
	documents
}: {
	documents: Promise<ApiResponse<DocumentSchema[]>> // Promise
}) {
	const router = useRouter()
	const documentsResponse = useApiResponse<DocumentSchema[]>(documents)
	const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
	const { openModal, closeModal } = useModalStore()
	const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const [documentToEdit, setDocumentToEdit] = useState<DocumentSchema | null>(
		null
	)
	const [isUpdatingTitle, setIsUpdatingTitle] = useState(false)
	const [documentToShare, setDocumentToShare] = useState<DocumentSchema | null>(
		null
	)
	const [searchTerm, setSearchTerm] = useState('')
	const [documentFilter, setDocumentFilter] =
		useState<DocumentLibraryFilterValue>('all')

	const documentCounts = useMemo(() => {
		const documents = documentsResponse ?? []

		return {
			total: documents.length,
			owned: documents.filter((document) => document.canManage).length,
			shared: documents.filter((document) => !document.canManage).length
		}
	}, [documentsResponse])

	const filteredDocuments = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase()
		const documents = documentsResponse ?? []

		const documentsByOwnership = documents.filter((document) => {
			if (documentFilter === 'owned') return document.canManage
			if (documentFilter === 'shared') return !document.canManage

			return true
		})

		if (!normalizedSearch) return documentsByOwnership

		return documentsByOwnership.filter((document) => {
			const searchableText = [document.title, document.filename, document.id]
				.filter(Boolean)
				.join(' ')
				.toLowerCase()

			return searchableText.includes(normalizedSearch)
		})
	}, [documentFilter, documentsResponse, searchTerm])

	function handleDeleteClick(id: string) {
		setDocumentToDelete(id)
		openModal('delete-document')
	}

	function handleEditTitleClick(document: DocumentSchema) {
		setDocumentToEdit(document)
		setActiveDocumentId(null)
		openModal('edit-document-title')
	}

	function handleShareClick(document: DocumentSchema) {
		setDocumentToShare(document)
		setActiveDocumentId(null)
		openModal('share-document')
	}

	async function confirmEditTitle(title: string) {
		if (!documentToEdit) return

		setIsUpdatingTitle(true)

		const response = await apiAction<DocumentSchema, UpdateDocumentSchema>({
			method: 'patch',
			url: API_ROUTES.DOCUMENTS.BY_ID(documentToEdit.id),
			data: { title },
			tags: [RESOURCES.DOCUMENTS],
			successMessage: 'Titulo atualizado com sucesso!'
		})

		setIsUpdatingTitle(false)

		if (!response.data) {
			toast.error(response.message)
			return
		}

		toast.success(response.message)
		closeModal()
		setDocumentToEdit(null)
		router.refresh()
	}

	async function confirmDelete() {
		if (!documentToDelete) return

		setIsDeleting(true)

		const response = await apiAction({
			method: 'delete',
			url: API_ROUTES.DOCUMENTS.BY_ID(documentToDelete),
			tags: [RESOURCES.DOCUMENTS],
			successMessage: 'Documento Excluído com Sucesso!'
		})

		setIsDeleting(false)

		if (!response.data) {
			toast.error(response.message)
			return
		}

		toast.success(response.message)
		closeModal()
		setDocumentToDelete(null)
	}

	function handleCloseModal() {
		closeModal()
		setDocumentToDelete(null)
		setDocumentToEdit(null)
		setDocumentToShare(null)
	}

	if (!documentsResponse || documentsResponse.length === 0) {
		return (
			<div className={styles.emptyContainer}>
				<div className={styles.emptyContent}>
					<div className={styles.iconWrapper}>
						<FolderOpen
							size={48}
							strokeWidth={1.2}
							className={styles.emptyIcon}
						/>
					</div>
					<h2 className={styles.emptyTitle}>Sua biblioteca está vazia</h2>
					<p className={styles.emptyDescription}>
						Nenhum documento encontrado :(
					</p>
				</div>
			</div>
		)
	}

	return (
		<article className={styles.container}>
			<ModalDelete
				onConfirm={confirmDelete}
				onCancel={handleCloseModal}
				isDeleting={isDeleting}
			/>
			<ModalEditTitle
				initialTitle={documentToEdit?.title ?? documentToEdit?.filename ?? ''}
				isSaving={isUpdatingTitle}
				onConfirm={confirmEditTitle}
				onCancel={handleCloseModal}
			/>
			<ModalShareDocument
				document={documentToShare}
				onCancel={handleCloseModal}
				onSaved={() => {
					handleCloseModal()
					router.refresh()
				}}
			/>
			<div className={styles.toolbar}>
				<div className={styles.searchBar}>
					<Search className={styles.searchIcon} size={20} aria-hidden="true" />
					<input
						className={styles.searchInput}
						type="search"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Pesquisar livros"
						aria-label="Pesquisar livros"
					/>
					{searchTerm && (
						<button
							type="button"
							className={styles.clearSearchButton}
							onClick={() => setSearchTerm('')}
							aria-label="Limpar pesquisa"
						>
							<X size={18} />
						</button>
					)}
				</div>
				<DocumentLibraryFilter
					value={documentFilter}
					totalCount={documentCounts.total}
					ownedCount={documentCounts.owned}
					sharedCount={documentCounts.shared}
					onChange={setDocumentFilter}
				/>
			</div>
			{filteredDocuments.length === 0 ? (
				<div className={styles.noResults}>
					<FolderOpen size={40} strokeWidth={1.3} />
					<p>Nenhum livro encontrado.</p>
				</div>
			) : (
				<div className={styles.grid}>
					{filteredDocuments.map((document) => (
						<div key={document.id} className={styles.card}>
							<div className={styles.cardHeader}>
								<h3 className={styles.title} title={document.filename}>
									{document.title ?? document.filename}
								</h3>
								<span className={styles.date}>
									Criado em{' '}
									{new Intl.DateTimeFormat('pt-BR', {
										day: '2-digit',
										month: 'long',
										year: 'numeric'
									}).format(new Date(document.createdAt))}
								</span>
							</div>
							<div className={styles.cardBody}>
								<ThumbnailPdf
									url={`/api/documents/${document.id}/file`}
									className={styles.cardImage}
								/>
								<button
									type="button"
									className={styles.triggerButton}
									onClick={() => setActiveDocumentId(document.id)}
								/>
								{activeDocumentId === document.id && (
									<div className={styles.overlay}>
										<div className={styles.actionButtons}>
											<Link
												href={`/view/${document.id}`}
												rel="noopener noreferrer"
												className={styles.actionButton}
											>
												<Eye />
												Visualizar
											</Link>
											{document.canManage && (
												<>
													<button
														type="button"
														className={styles.actionButton}
														onClick={() => handleEditTitleClick(document)}
													>
														<Pencil />
														Editar titulo
													</button>
													<button
														type="button"
														className={styles.actionButton}
														onClick={() => handleShareClick(document)}
													>
														<Share />
														Compartilhar
													</button>
													<button
														type="button"
														className={styles.actionButton}
														onClick={() => handleDeleteClick(document.id)}
													>
														<Trash />
														Excluir
													</button>
												</>
											)}
											<button
												type="button"
												className={styles.closeBtn}
												onClick={() => setActiveDocumentId(null)}
											>
												<X />
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</article>
	)
}
