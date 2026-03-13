'use client'

import { RESOURCES } from '@repo/constants'
import type { CreateDocumentSchema, DocumentSchema } from '@repo/schemas'
import toast from 'react-hot-toast'
import { apiAction } from '@/lib/api/actions'
import { useModalStore } from '@/lib/store/useModal'
import styles from './create-button.module.css'

interface CreateBookButtonProps {
	file: File | null
}

export function CreateBookButton({ file }: CreateBookButtonProps) {
	async function handleCreate() {
		if (!file) {
			return toast.error('Por favor, selecione um arquivo.')
		}
		const formData = new FormData()
		formData.append('file', file)
		formData.append('filename', file.name)
		formData.append('path', 'uploads')
		const actionPromise = apiAction<DocumentSchema, CreateDocumentSchema>({
			method: 'post',
			url: '/documents',
			data: formData as unknown as CreateDocumentSchema,
			successMessage: 'Documento criado com sucesso!',
			tags: [RESOURCES.DOCUMENTS]
		})
		const { data, message } = await toast.promise(actionPromise, {
			loading: 'Criando documento...'
		})
		if (data) {
			toast.success(message)
			useModalStore.setState({ isOpen: false })
		} else {
			toast.error(message)
		}
	}
	return (
		<div className={styles['button-group']}>
			<button className={styles.button} type="button" onClick={handleCreate}>
				Criar Livro
			</button>
		</div>
	)
}
