'use client'

import { Document, Page } from 'react-pdf'
import './styles.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { useFlipbookStore } from '@/lib/store/useFlipbook'
import type { FlipBookType } from './type'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LoadingSkeleton from '@/ui/components/skeletons/workspace/LoadingSkeleton/LoadingSkeleton'
import { Button } from '@repo/ui/button'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type FlipBookProps = {
	type: FlipBookType
	file: File | string
	width?: number
	height?: number
}

export default function FlipBook({
	file,
	type = 'magazine',
	width = 400,
	height = 565,
}: FlipBookProps) {
	const aspectRatio = 0.70796
	let finalWidth = width
	let finalHeight = height

	if (width !== 400) {
		finalHeight = Math.round(width / Math.max(aspectRatio, 0.1))
	} else if (height !== 565) {
		finalWidth = Math.round(height * aspectRatio)
	}

	const { setCurrentPage, setTotalPages, currentPage } = useFlipbookStore()
	const [numPages, setNumPages] = useState<number>(0)
	const [currentState, setCurrentState] = useState(1)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	// Pre-load audio once
	useEffect(() => {
		audioRef.current = new Audio('/sounds/page_flip.MP3')
		audioRef.current.playbackRate = 2.5
		audioRef.current.volume = 1
	}, [])

	// Derived values:
	// - numOfPapers: each paper has a front and back face, holding 2 PDF pages
	const numOfPapers = Math.ceil(numPages / 2)
	// Se a contagem total de páginas for par, permitimos fechar o livro na última capa vazia (+)
	// Se for ímpar, o documento termina naturalmente no último spread aberto.
	const maxState = numPages > 0
		? (numPages % 2 === 0 ? numOfPapers + 1 : numOfPapers)
		: 1;

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages)
		setTotalPages(numPages)
	}

	// Sync external store → internal state (e.g. slider navigation)
	useEffect(() => {
		if (currentPage >= 0 && numPages > 0) {
			const targetState = Math.floor(currentPage / 2) + 1
			if (currentState !== targetState) {
				setCurrentState(targetState)
			}
		}
	}, [currentPage, numPages])

	const playFlipSound = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.currentTime = 0
			audioRef.current.play().catch(() => { })
		}
	}, [])

	const handleFlipNext = useCallback(() => {
		if (currentState < maxState) {
			playFlipSound()
			const nextState = currentState + 1
			setCurrentState(nextState)
			setCurrentPage((nextState - 1) * 2)
		}
	}, [currentState, maxState, playFlipSound, setCurrentPage])

	const handleFlipPrev = useCallback(() => {
		if (currentState > 1) {
			playFlipSound()
			const prevState = currentState - 1
			setCurrentState(prevState)
			setCurrentPage((prevState - 1) * 2)
		}
	}, [currentState, playFlipSound, setCurrentPage])

	useEffect(() => {
		document.body.classList.add('no-scroll')
		return () => document.body.classList.remove('no-scroll')
	}, [])

	// ── Book positioning ──────────────────────────────────────────────
	// State 1  → closed, cover on right  →  translateX(0%)
	// State Max (if it's a true back cover) → translateX(100%)
	// Otherwise → book open, centered    →  translateX(50%)
	const isClosedFront = currentState === 1
	const isClosedBack = currentState > numOfPapers
	const isOpen = currentState > 1 && currentState <= numOfPapers

	const bookTransform =
		isClosedFront
			? 'translateX(0%)'
			: isClosedBack
				? 'translateX(100%)'
				: 'translateX(50%)'

	// Buttons slide outward when book is open
	const btnOffset = finalWidth / 2 + 24;
	const prevBtnTransform = isOpen
		? `translateX(-${btnOffset}px)`
		: 'translateX(0px)'

	const nextBtnTransform = isOpen
		? `translateX(${btnOffset}px)`
		: 'translateX(0px)'

	return (
		<div
			className="custom-flipbook-container"
			style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
		>
			<button
				className="flip-btn"
				onClick={handleFlipPrev}
				style={{ transform: prevBtnTransform }}
				disabled={currentState === 1}
				aria-label="Página anterior"
				type="button"
			>
				<ChevronLeft size={64} className="style-arrow" />
			</button>

			<div
				className="book"
				style={{ width: finalWidth, height: finalHeight, transform: bookTransform }}
			>
				<Document
					className="book-document"
					file={file}
					onLoadSuccess={onDocumentLoadSuccess}
					error="Um erro ocorreu!"
					loading={<div className="loading-container"><LoadingSkeleton /></div>}
					noData="Nenhum arquivo PDF selecionado"
					options={{
						cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
						cMapPacked: true,
					}}
				>
					{numPages > 0 &&
						Array.from({ length: numOfPapers }).map((_, paperIndex) => {
							const paperNumber = paperIndex + 1

							// Page layout per paper:
							//   front face → odd  PDF page  (1, 3, 5 …)
							//   back face  → even PDF page  (2, 4, 6 …)
							//
							// After flipping paper N the book spread shows:
							//   LEFT  = back  of paper N   (even page)
							//   RIGHT = front of paper N+1 (next odd page)
							//
							// Example with cover PDF:
							//   Paper 0 front = pg1 (cover)   | Paper 0 back = pg2
							//   Paper 1 front = pg3           | Paper 1 back = pg4
							//
							// Flip paper 0 → LEFT: pg2, RIGHT: pg3  ✓
							const pageFront = paperIndex * 2 + 1
							const pageBack = paperIndex * 2 + 2

							const isFlipped = currentState > paperNumber

							// Using CSS variables to handle the z-index delayed transitions
							const zUnflipped = numOfPapers - paperIndex
							const zFlipped = paperNumber

							// Windowed rendering: only materialise the 2 papers around
							// the current page to keep the DOM light.
							const isNear =
								Math.abs(paperNumber - currentState) <= 2 ||
								(currentState === 1 && paperNumber <= 3) ||
								(currentState === maxState && paperNumber >= numOfPapers - 2)

							const isLastPaper = paperNumber === numOfPapers

							const isInteractiveRight =
								(paperNumber === currentState && currentState <= numOfPapers) ||
								(currentState > numOfPapers && isLastPaper)

							const isInteractiveLeft =
								paperNumber === currentState - 1

							let paperOnClick = undefined
							if (isInteractiveRight) paperOnClick = handleFlipNext
							if (isInteractiveLeft) paperOnClick = handleFlipPrev

							const interactiveClass = isInteractiveRight
								? ' interactive-right'
								: isInteractiveLeft
									? ' interactive-left'
									: ''

							const paperStyle = {
								'--z-unflipped': zUnflipped,
								'--z-flipped': zFlipped,
							} as React.CSSProperties

							return (
								<div
									key={`paper-${paperIndex}`}
									className={`paper${isFlipped ? ' flipped' : ''}${interactiveClass}`}
									style={paperStyle}
								>
									<div className="page-turner">
										{/* ── Front face (right side when book is open) ── */}
										<div className="front">
											{isInteractiveRight && (
												<>
													<button className="fold-zone fold-zone-top" onClick={paperOnClick} tabIndex={0} type="button" />
													<button className="fold-zone fold-zone-bottom" onClick={paperOnClick} tabIndex={0} type="button" />
												</>
											)}
											<div className={`front-content ${type}`}>
												{isNear && (
													<Page
														width={finalWidth}
														height={finalHeight}
														canvasBackground="white"
														devicePixelRatio={1}
														pageNumber={pageFront}
														loading=""
														noData=""
														renderAnnotationLayer={false}
														renderTextLayer={false}
													/>
												)}
											</div>
										</div>

										{/* ── Back face (left side after flip) ── */}
										<div className="back">
											{isInteractiveLeft && (
												<>
													<button className="fold-zone fold-zone-top" onClick={paperOnClick} tabIndex={0} type="button" />
													<button className="fold-zone fold-zone-bottom" onClick={paperOnClick} tabIndex={0} type="button" />
												</>
											)}
											<div className={`back-content ${type}`}>
												{isNear && pageBack <= numPages && (
													<Page
														width={finalWidth}
														height={finalHeight}
														canvasBackground="white"
														devicePixelRatio={1}
														pageNumber={pageBack}
														loading=""
														noData=""
														renderAnnotationLayer={false}
														renderTextLayer={false}
													/>
												)}
											</div>
										</div>
									</div>
								</div>
							)
						})}
				</Document>
			</div>

			<button
				className="flip-btn"
				onClick={handleFlipNext}
				style={{ transform: nextBtnTransform }}
				disabled={currentState >= maxState}
				aria-label="Próxima página"
				type="button"
			>
				<ChevronRight size={64} className="style-arrow" />
			</button>
		</div>
	)
}
