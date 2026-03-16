'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
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

		async function generate() {
			try {
				const pdfjs = await import('pdfjs-dist')

				// Configuração do Worker
				pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

				const loadingTask = pdfjs.getDocument(url)
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
			} catch (err) {
				console.error('Erro ao gerar thumbnail:', err)
			} finally {
				if (isMounted) setLoading(false)
			}
		}

		generate()

		return () => {
			isMounted = false
		}
	}, [url])

	if (loading || !thumbnail) {
		return (
			<div className={`${styles.placeholder} ${className}`}>
				<span>{loading ? 'Carregando...' : 'Thumbnail não disponível'}</span>
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
