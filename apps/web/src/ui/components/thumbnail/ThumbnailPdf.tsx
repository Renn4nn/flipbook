'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
export default function ThumbnailPdf({
	url,
	className
}: {
	url: string
	className?: string
}) {
	const [thumbnail, setThumbnail] = useState<string | null>(null)

	useEffect(() => {
		async function generate() {
			// REFATORAR ISSO AQUI
			try {
				const pdfjs = await import('pdfjs-dist')
				pdfjs.GlobalWorkerOptions.workerSrc = new URL(
					'pdfjs-dist/build/pdf.worker.min.mjs',
					import.meta.url
				).toString()
				const loadingTask = pdfjs.getDocument(url)
				const pdf = await loadingTask.promise
				const page = await pdf.getPage(1)
				const viewport = page.getViewport({ scale: 0.6 })
				const canvas = document.createElement('canvas')
				const context = canvas.getContext('2d')

				canvas.height = viewport.height
				canvas.width = viewport.width

				if (context) {
					await page.render({
						canvasContext: context,
						viewport: viewport,
						canvas: canvas
					}).promise
					setThumbnail(canvas.toDataURL('image/jpeg'))
				}
			} catch (err) {
				console.error('Erro na capa:', err)
			}
		}
		generate()
	}, [url])

	if (!thumbnail)
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '350px',
					background: '#222',
					borderRadius: '8px',
					color: '#fff',
					fontWeight: 'bold'
				}}
			>
				<span>Thumbnail não disponível</span>
			</div>
		)

	return (
		<Image
			src={thumbnail}
			alt="Thumbnail do PDF"
			width={300}
			height={300}
			sizes="100vw"
			className={className}
		/>
	)
}
