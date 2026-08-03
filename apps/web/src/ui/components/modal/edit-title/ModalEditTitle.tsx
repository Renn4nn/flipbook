'use client'

import { useEffect, useState } from 'react'
import Modal from '@/ui/components/modal/Modal'
import styles from './modal-edit-title.module.css'

type ModalEditTitleProps = {
	initialTitle: string
	isSaving: boolean
	onCancel: () => void
	onConfirm: (title: string) => void
}

export default function ModalEditTitle({
	initialTitle,
	isSaving,
	onCancel,
	onConfirm
}: ModalEditTitleProps) {
	const [title, setTitle] = useState(initialTitle)

	useEffect(() => {
		setTitle(initialTitle)
	}, [initialTitle])

	const trimmedTitle = title.trim()

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!trimmedTitle || isSaving) return
		onConfirm(trimmedTitle)
	}

	return (
		<Modal title="Editar titulo" id="edit-document-title">
			<form className={styles.form} onSubmit={handleSubmit}>
				<label className={styles.label} htmlFor="document-title">
					Novo titulo
				</label>
				<input
					id="document-title"
					className={styles.input}
					type="text"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					disabled={isSaving}
					maxLength={120}
				/>
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
						className={styles.confirmButton}
						disabled={!trimmedTitle || isSaving}
					>
						{isSaving ? 'Salvando...' : 'Salvar'}
					</button>
				</div>
			</form>
		</Modal>
	)
}
