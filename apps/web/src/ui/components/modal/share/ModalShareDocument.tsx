'use client'

import { API_ROUTES, RESOURCES } from '@repo/constants'
import type {
	DocumentSchema,
	DocumentSharingSchema,
	UpdateDocumentSharingSchema
} from '@repo/schemas'
import { Copy, Globe2, Search, UserPlus, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { apiAction } from '@/lib/api/actions'
import Modal from '@/ui/components/modal/Modal'
import styles from './modal-share-document.module.css'

type ModalShareDocumentProps = {
	document: DocumentSchema | null
	onCancel: () => void
	onSaved: () => void
}

type SharingSnapshot = Pick<DocumentSharingSchema, 'isPublic' | 'userIds'>

export default function ModalShareDocument({
	document,
	onCancel,
	onSaved
}: ModalShareDocumentProps) {
	const [sharing, setSharing] = useState<DocumentSharingSchema | null>(null)
	const [initial, setInitial] = useState<SharingSnapshot | null>(null)
	const [search, setSearch] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const loadRequest = useRef(0)

	const loadSharing = useCallback(async (documentId: string) => {
		const requestId = ++loadRequest.current
		setIsLoading(true)
		setError(null)
		setSharing(null)
		setInitial(null)
		setSearch('')

		const response = await apiAction<DocumentSharingSchema>({
			method: 'get',
			url: API_ROUTES.DOCUMENTS.SHARING(documentId),
			successMessage: ''
		})

		if (requestId !== loadRequest.current) return
		setIsLoading(false)

		if (!response.data) {
			setError(response.message)
			return
		}

		setSharing(response.data)
		setInitial({
			isPublic: response.data.isPublic,
			userIds: [...response.data.userIds]
		})
	}, [])

	useEffect(() => {
		if (!document) {
			loadRequest.current += 1
			setSharing(null)
			setInitial(null)
			setSearch('')
			setError(null)
			return
		}

		void loadSharing(document.id)
	}, [document, loadSharing])

	const selectedUsers = useMemo(() => {
		if (!sharing) return []
		return sharing.availableUsers.filter((user) =>
			sharing.userIds.includes(user.id)
		)
	}, [sharing])

	const filteredUsers = useMemo(() => {
		if (!sharing) return []
		const normalizedSearch = search.trim().toLowerCase()

		return sharing.availableUsers.filter(
			(user) =>
				!sharing.userIds.includes(user.id) &&
				(!normalizedSearch ||
					user.login.toLowerCase().includes(normalizedSearch))
		)
	}, [search, sharing])

	const hasChanges = useMemo(() => {
		if (!sharing || !initial) return false
		return (
			sharing.isPublic !== initial.isPublic ||
			[...sharing.userIds].sort().join(',') !==
				[...initial.userIds].sort().join(',')
		)
	}, [initial, sharing])

	function addUser(userId: string) {
		setSharing((current) =>
			current ? { ...current, userIds: [...current.userIds, userId] } : current
		)
		setSearch('')
	}

	function removeUser(userId: string) {
		setSharing((current) =>
			current
				? {
						...current,
						userIds: current.userIds.filter((id) => id !== userId)
					}
				: current
		)
	}

	async function copyPublicLink() {
		if (!document) return
		try {
			await navigator.clipboard.writeText(
				`${window.location.origin}/view/${document.id}`
			)
			toast.success('Link copiado!')
		} catch {
			toast.error('Não foi possível copiar o link.')
		}
	}

	async function handleSave(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!document || !sharing || !hasChanges || isSaving) return

		setIsSaving(true)
		setError(null)
		const response = await apiAction<
			DocumentSharingSchema,
			UpdateDocumentSharingSchema
		>({
			method: 'put',
			url: API_ROUTES.DOCUMENTS.SHARING(document.id),
			data: {
				isPublic: sharing.isPublic,
				userIds: sharing.userIds
			},
			tags: [RESOURCES.DOCUMENTS],
			successMessage: 'Compartilhamento atualizado com sucesso!'
		})
		setIsSaving(false)

		if (!response.data) {
			setError(response.message)
			return
		}

		toast.success(response.message)
		onSaved()
	}

	return (
		<Modal title="Compartilhar livro" id="share-document">
			{isLoading && <p className={styles.status}>Carregando opções...</p>}
			{error && <p className={styles.error}>{error}</p>}
			{!sharing && (
				<div className={styles.actions}>
					<button
						type="button"
						className={styles.cancelButton}
						onClick={onCancel}
					>
						Cancelar
					</button>
					{!isLoading && (
						<button
							type="button"
							className={styles.saveButton}
							onClick={() => document && void loadSharing(document.id)}
						>
							Tentar novamente
						</button>
					)}
				</div>
			)}
			{sharing && !isLoading && (
				<form className={styles.form} onSubmit={handleSave}>
					<label className={styles.publicOption}>
						<span className={styles.publicIcon}>
							<Globe2 size={20} color="grey" strokeWidth={1.5} />
						</span>
						<span className={styles.publicText}>
							<strong>Documento público</strong>
							<small>Qualquer pessoa com o link poderá visualizar.</small>
						</span>
						<input
							className={styles.switchInput}
							type="checkbox"
							checked={sharing.isPublic}
							onChange={(event) =>
								setSharing((current) =>
									current
										? { ...current, isPublic: event.target.checked }
										: current
								)
							}
						/>
						<span className={styles.switch} aria-hidden="true" />
					</label>

					{sharing.isPublic && (
						<div className={styles.linkRow}>
							<span>{`${window.location.origin}/view/${document?.id}`}</span>
							<button type="button" onClick={copyPublicLink}>
								<Copy size={16} /> Copiar link
							</button>
						</div>
					)}

					<section className={styles.section}>
						<div className={styles.sectionHeader}>
							<strong>Pessoas com acesso</strong>
							<span>{selectedUsers.length}</span>
						</div>
						{selectedUsers.length === 0 ? (
							<p className={styles.empty}>Nenhuma pessoa adicionada.</p>
						) : (
							<div className={styles.chips}>
								{selectedUsers.map((user) => (
									<span className={styles.chip} key={user.id}>
										{user.login}
										<button
											type="button"
											onClick={() => removeUser(user.id)}
											aria-label={`Remover ${user.login}`}
										>
											<X size={14} />
										</button>
									</span>
								))}
							</div>
						)}
					</section>

					<section className={styles.section}>
						<label className={styles.searchLabel} htmlFor="share-user-search">
							Adicionar pessoas
						</label>
						<div className={styles.searchBox}>
							<Search size={17} />
							<input
								id="share-user-search"
								type="search"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Buscar por login"
							/>
						</div>
						<div className={styles.userList}>
							{filteredUsers.length === 0 ? (
								<p className={styles.empty}>Nenhum usuário disponível.</p>
							) : (
								filteredUsers.map((user) => (
									<div className={styles.userRow} key={user.id}>
										<span>{user.login}</span>
										<button type="button" onClick={() => addUser(user.id)}>
											<UserPlus size={16} /> Adicionar
										</button>
									</div>
								))
							)}
						</div>
					</section>

					<div className={styles.actions}>
						<button
							type="button"
							className={styles.cancelButton}
							onClick={onCancel}
							disabled={isSaving}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className={styles.saveButton}
							disabled={!hasChanges || isSaving}
						>
							{isSaving ? 'Salvando...' : 'Salvar alterações'}
						</button>
					</div>
				</form>
			)}
		</Modal>
	)
}
