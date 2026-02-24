'use client'

import { Document, Page } from 'react-pdf'
import './styles.css'
import { useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import type { FlipBookType } from './type'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type FlipBookProps = {
	type: FlipBookType
	file: File
	width?: number
	height?: number
}

export default function FlipBook({
	file,
	type = 'magazine',
	width = 400,
	height = 565
}: FlipBookProps) {
	const aspectRatio = 0.70796
	let [finalWidth, finalHeight] = [width, height]

	if (width !== 400) {
		finalHeight = Math.round(width / aspectRatio)
	} else if (height !== 565) {
		finalWidth = Math.round(height * aspectRatio)
	}

	const [numPages, setNumPages] = useState<number>()

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages)
	}

	const handleOnFlip = () => {
		const audio = new Audio('/sounds/page_flip.MP3')
		audio.playbackRate = 2.5
		audio.volume = 1
		audio.play()
	}

	return (
		<Document
			file={file}
			onLoadSuccess={onDocumentLoadSuccess}
			error={'Um erro ocorreu!'}
			loading={'Carregando PDF…'}
			noData={'Nenhum arquivo PDF selecionado'}
		>
			{/* @ts-ignore */}
			<HTMLFlipBook
				width={finalWidth}
				height={finalHeight}
				size="fixed"
				maxShadowOpacity={0.2}
				drawShadow={true}
				showCover={true}
				flippingTime={750}
				onFlip={handleOnFlip}
				showPageCorners={true}
			>
				{numPages &&
					Array.from({ length: numPages }, (_, i) => i + 1).map((pn) => (
						<div
							key={`flipbook-page-${pn}`}
							className={`flipbook-page-wrapper ${type}`}
						>
							<Page
								width={finalWidth}
								pageNumber={pn}
								loading="Carregando página…"
								noData="Página vazia"
								renderAnnotationLayer={false}
								renderTextLayer={false}
							/>
						</div>
					))}
			</HTMLFlipBook>
		</Document>
	)
}
