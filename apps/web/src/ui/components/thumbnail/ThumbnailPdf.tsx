'use client'

import Image from 'next/image'
import type { PDFDocumentLoadingTask } from 'pdfjs-dist'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSkeleton from '../skeletons/library/LoadingSkeleton/LoadingSkeleton'
import styles from './thumbnail-pdf.module.css'

export default function ThumbnailPdf({
	url,
	className
}: {
	url: string
	className?: string
}) {
	const [thumbnail, setThumbnail] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let isMounted = true
		let loadingTask: PDFDocumentLoadingTask | null = null
		setLoading(true)
		setThumbnail(null)

		async function generate() {
			try {
				const pdfjs = await import('pdfjs-dist')

				// Configuração do Worker
				pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

				loadingTask = pdfjs.getDocument(url)
				const pdf = await loadingTask.promise
				const page = await pdf.getPage(1)

				const viewport = page.getViewport({ scale: 0.6 })
				const canvas = document.createElement('canvas')
				const context = canvas.getContext('2d')

				canvas.height = viewport.height
				canvas.width = viewport.width

				if (context && isMounted) {
					await page.render({
						canvasContext: context,
						viewport: viewport,
						canvas: canvas
					}).promise

					setThumbnail(canvas.toDataURL('image/jpeg'))
				}

				// Limpa a memória quando finaliza a geração
				if (loadingTask && isMounted) {
					await loadingTask.destroy()
					loadingTask = null
				}
			} catch (error) {
				if (!isMounted) return

				console.error('Erro ao gerar thumbnail')
			} finally {
				if (isMounted) setLoading(false)
			}
		}

		generate()

		return () => {
			isMounted = false
			if (loadingTask) {
				loadingTask.destroy().catch(() => { })
			}
		}
	}, [url])

	if (loading || !thumbnail) {
		return (
			<div className={`${styles.placeholder} ${className}`}>
				<span>
					{loading ? <LoadingSkeleton /> : 'Thumbnail não disponível'}
				</span>
			</div>
		)
	}

	return (
		<Image
			src={thumbnail}
			alt="Thumbnail do PDF"
			width={300}
			height={450}
			priority={false}
			className={className}
		/>
	)
}
