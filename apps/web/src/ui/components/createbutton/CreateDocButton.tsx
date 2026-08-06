'use client'

import { API_ROUTES, RESOURCES } from '@repo/constants'
import type { CreateDocumentSchema, DocumentSchema } from '@repo/schemas'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import { apiAction } from '@/lib/api/actions'
import { useModalStore } from '@/lib/store/useModal'
import styles from './create-button.module.css'

interface CreateBookButtonProps {
	file: File | null
	setIsUploading?: (uploading: boolean) => void
	setUploadProgress?: (progress: number) => void
	disabled?: boolean
}

export function CreateBookButton({
	file,
	setIsUploading,
	setUploadProgress,
	disabled
}: CreateBookButtonProps) {
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

	async function handleCreate() {
		if (!file) {
			return toast.error('Por favor, selecione um arquivo.')
		}

		setIsUploading?.(true)
		setUploadProgress?.(0)

		// Simula progresso durante o upload
		let progress = 0
		progressIntervalRef.current = setInterval(() => {
			progress += Math.random() * 15
			if (progress > 90) {
				progress = 90
				if (progressIntervalRef.current) {
					clearInterval(progressIntervalRef.current)
				}
			}
			setUploadProgress?.(Math.floor(progress))
		}, 300)

		const formData = new FormData()
		formData.append('file', file)
		formData.append('filename', file.name)
		formData.append('path', 'uploads')
		formData.append('title', file.name.replace('.pdf', ''))
		formData.append('size', file.size.toString())

		// Calcula o número de páginas com pdfjs
		let numPages = 0
		try {
			const pdfjs = await import('pdfjs-dist')
			pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

			const arrayBuffer = await file.arrayBuffer()
			const loadingTask = pdfjs.getDocument(arrayBuffer)
			const pdf = await loadingTask.promise
			numPages = pdf.numPages
			await loadingTask.destroy()
		} catch (err) {
			console.error('Erro ao ler número de páginas do PDF', err)
		}

		formData.append('pages', numPages.toString())

		const actionPromise = apiAction<DocumentSchema, CreateDocumentSchema>({
			method: 'post',
			url: API_ROUTES.DOCUMENTS.BASE,
			data: formData as unknown as CreateDocumentSchema,
			successMessage: 'Documento criado com sucesso!',
			tags: [RESOURCES.DOCUMENTS]
		})

		const { data, message } = await toast.promise(actionPromise, {
			loading: 'Criando documento...'
		})

		// Completa o progresso
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current)
		}
		setUploadProgress?.(100)

		if (data) {
			toast.success(message)
			setTimeout(() => {
				setIsUploading?.(false)
				useModalStore.getState().closeModal()
			}, 500)
		} else {
			setIsUploading?.(false)
			setUploadProgress?.(0)
			toast.error(message)
		}
	}

	return (
		<div className={styles['button-group']}>
			<button
				className={styles.button}
				type="button"
				onClick={handleCreate}
				disabled={disabled}
			>
				{disabled ? 'Enviando...' : 'Criar Livro'}
			</button>
		</div>
	)
}
