'use client'

import type { ApiResponse, DocumentSchema } from '@repo/schemas'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import useApiResponse from '@/lib/api/hooks'
import styles from './workspace.module.css'
import LoadingSkeleton from '@/ui/components/skeletons/workspace/LoadingSkeleton/LoadingSkeleton'
import { useState } from 'react'
import { Trash, X, Eye, Share } from 'lucide-react';
import { apiAction } from '@/lib/api/actions'
import { API_ROUTES, RESOURCES } from '@repo/constants'
import toast from 'react-hot-toast'
import ModalDelete from '@/ui/components/modal/delete/ModalDelete'
import { useModalStore } from '@/lib/store/useModal'
import { FolderOpen, Plus } from 'lucide-react'

const ThumbnailPdf = dynamic(
	() => import('@/ui/components/thumbnail/ThumbnailPdf'),
	{
		ssr: false,
		loading: () => <div className={styles.loadingContainer}><LoadingSkeleton /></div>
	}
)

export default function Workspace({
	documents
}: {
	documents: Promise<ApiResponse<DocumentSchema[]>> // Promise
}) {

	const documentsResponse = useApiResponse<DocumentSchema[]>(documents)
	const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
	const { openModal, closeModal } = useModalStore();
	const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	function handleDeleteClick(id: string) {
		setDocumentToDelete(id);
		openModal('delete-document');
	}

	async function confirmDelete() {
		if (!documentToDelete) return;

		setIsDeleting(true);

		const response = await apiAction({
			method: 'delete',
			url: `http://localhost:3001${API_ROUTES.DOCUMENTS.BY_ID(documentToDelete)}`,
			tags: [RESOURCES.DOCUMENTS],
			successMessage: "Documento Excluído com Sucesso!"
		});

		setIsDeleting(false);

		if (!response.data) {
			toast.error(response.message);
			return;
		}

		toast.success(response.message);
		closeModal();
		setDocumentToDelete(null);
	}

	function handleCloseModal() {
		closeModal();
		setDocumentToDelete(null);
	}

	if (!documentsResponse || documentsResponse.length === 0) {
		return (
			<div className={styles.emptyContainer}>
				<div className={styles.emptyContent}>
					<div className={styles.iconWrapper}>
						<FolderOpen size={48} strokeWidth={1.2} className={styles.emptyIcon} />
					</div>
					<h2 className={styles.emptyTitle}>Sua biblioteca está vazia</h2>
					<p className={styles.emptyDescription}>
						Nenhum documento encontrado :(
					</p>
				</div>
			</div>
		);
	}

	return (
		<article className={styles.container}>
			<ModalDelete onConfirm={confirmDelete} onCancel={handleCloseModal} isDeleting={isDeleting} />
			<div className={styles.grid}>
				{documentsResponse.map((document) => (
					<div key={document.id} className={styles.card}>
						<div className={styles.cardHeader}>
							<h3 className={styles.title} title={document.filename}>{document.title}</h3>
							<span className={styles.date}>
								Criado em:{' '}
								{new Intl.DateTimeFormat('pt-BR', {
									day: '2-digit',
									month: 'long',
									year: 'numeric'
								}).format(new Date(document.createdAt))}
							</span>
						</div>
						<div className={styles.cardBody}>
							<ThumbnailPdf
								url={`http://localhost:3001${document.path}`}
								className={styles.cardImage}
							/>
							<button
								className={styles.triggerButton}
								onClick={() => setActiveDocumentId(document.id)}
							/>
							{activeDocumentId === document.id && (
								<div className={styles.overlay}>
									<div className={styles.actionButtons}>
										<Link
											href={`/view/${document.id}`}
											target="_blank"
											rel="noopener noreferrer"
											className={styles.actionButton}
										>
											<Eye />Visualizar
										</Link>
										<button className={styles.actionButton} onClick={() => setActiveDocumentId(null)}><Share />Compartilhar</button>
										<button className={styles.actionButton} onClick={() => handleDeleteClick(document.id)}><Trash />Excluir</button>
										<button className={styles.closeBtn} onClick={() => setActiveDocumentId(null)}><X /></button>
									</div>
								</div>
							)}
						</div >
					</div >
				))
				}
			</div >
		</article >
	)
}
