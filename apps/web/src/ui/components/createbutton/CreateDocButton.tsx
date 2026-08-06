'use client'

import { API_ROUTES } from '@repo/constants'
import type { ApiResponse, DocumentSchema } from '@repo/schemas'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import toast from 'react-hot-toast'
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
	const router = useRouter()
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

		const loadingToast = toast.loading('Criando documento...')

		try {
			const response = await fetch(API_ROUTES.DOCUMENTS.BASE, {
				method: 'POST',
				body: formData
			})
			const result = (await response.json()) as ApiResponse<DocumentSchema>

			if (!response.ok || !('data' in result)) {
				toast.error(getApiErrorMessage(result), { id: loadingToast })
				setUploadProgress?.(0)
				return
			}

			setUploadProgress?.(100)
			toast.success('Documento criado com sucesso!', { id: loadingToast })
			useModalStore.getState().closeModal()
			router.refresh()
		} catch {
			toast.error('Não foi possível enviar o documento.', {
				id: loadingToast
			})
			setIsUploading?.(false)
			setUploadProgress?.(0)
		} finally {
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current)
				progressIntervalRef.current = null
			}
			setIsUploading?.(false)
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

function getApiErrorMessage(response: ApiResponse<DocumentSchema>): string {
	if ('error' in response) return response.error.message
	if ('errors' in response) {
		return response.errors[0]?.message ?? 'Não foi possível criar o documento.'
	}
	return 'Não foi possível criar o documento.'
}
