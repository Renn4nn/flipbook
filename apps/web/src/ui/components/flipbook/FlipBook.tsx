'use client'

import { Document, Page } from 'react-pdf'
import './styles.css'
import { useEffect, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { useFlipbookStore } from '@/lib/store/useFlipbook'
import type { FlipBookType } from './type'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type FlipBookProps = {
	type: FlipBookType
	file: File | string
	width?: number
	height?: number
}

export type FlipBookRef = {
	pageFlip: () => {
		turnToPage: (page: number) => void
		getCurrentPageIndex: () => number
	}
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

	const [numPages, setNumPages] = useState<number>(0)
	const bookRef = useRef<FlipBookRef>(null)
	const { setCurrentPage, setTotalPages, currentPage } = useFlipbookStore()

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		console.log('Numero de paginas: ', numPages)
		console.log('Total de paginas: ', numPages)
		setNumPages(numPages)
		setTotalPages(numPages)
	}

	const handleOnFlip = (e: { data: number }) => {
		const audio = new Audio('/sounds/page_flip.MP3')
		audio.playbackRate = 2.5
		audio.volume = 1
		audio.play()

		const pageIndex = e.data
		setCurrentPage(pageIndex)
	}

	useEffect(() => {
		document.body.classList.add('no-scroll')
		return () => {
			document.body.classList.remove('no-scroll')
		}
	}, [])

	useEffect(() => {
		if (bookRef.current?.pageFlip && currentPage >= 0) {
			const currentIndex = bookRef.current.pageFlip().getCurrentPageIndex()
			if (currentIndex !== currentPage) {
				bookRef.current.pageFlip().turnToPage(currentPage)
			}
		}
	}, [currentPage])

	return (
		<Document
			file={file}
			onLoadSuccess={onDocumentLoadSuccess}
			error={'Um erro ocorreu!'}
			loading={'Carregando PDF…'}
			noData={'Nenhum arquivo PDF selecionado'}
			options={{
				cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
				cMapPacked: true
			}}
		>
			{/* @ts-ignore */}
			<HTMLFlipBook
				ref={bookRef}
				width={finalWidth}
				height={finalHeight}
				size="fixed"
				showCover={true}
				onFlip={handleOnFlip}
				usePortrait={false}
				startPage={currentPage}
				clickEventForward={true}
				useMouseEvents={true}
				swipeDistance={30}
				showPageCorners={true}
				disableFlipByClick={false}
			>
				{numPages &&
					Array.from({ length: numPages }, (_, i) => i + 1).map((pn) => (
						<div
							key={`flipbook-page-${pn}`}
							className={`flipbook-page-wrapper ${type}`}
							style={{ width: finalWidth, height: finalHeight }}
						>
							<Page
								width={finalWidth}
								height={finalHeight}
								canvasBackground="white"
								devicePixelRatio={1}
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
