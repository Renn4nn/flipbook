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
import { PageSkeleton } from '../skeletons/workspace/PageSkeleton/PageSkeleton'
import { PageRander } from './PageRander/PageRander'

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
	const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false)
	const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 900)
			setScreenWidth(window.innerWidth)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	let finalWidth = width
	let finalHeight = height

	if (width !== 400) {
		finalHeight = Math.round(width / Math.max(aspectRatio, 0.1))
	} else if (height !== 565) {
		finalWidth = Math.round(height * aspectRatio)
	}

	if (isMobile) {
		const calculatedWidth = Math.min(340, screenWidth - 24)
		finalWidth = calculatedWidth
		finalHeight = Math.round(calculatedWidth / aspectRatio)
	}

	const { setCurrentPage, setTotalPages, currentPage } = useFlipbookStore()
	const [numPages, setNumPages] = useState<number>(0)
	const [currentState, setCurrentState] = useState(1)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		audioRef.current = new Audio('/sounds/page_flip.MP3')
		audioRef.current.playbackRate = 2.5
		audioRef.current.volume = 1
	}, [])

	const numOfPapers = isMobile ? numPages : Math.ceil(numPages / 2)
	const maxState = numPages > 0
		? (isMobile ? numPages : (numPages % 2 === 0 ? numOfPapers + 1 : numOfPapers))
		: 1;

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages)
		setTotalPages(numPages)
	}

	useEffect(() => {
		if (currentPage >= 0 && numPages > 0) {
			const targetState = isMobile ? currentPage + 1 : Math.floor(currentPage / 2) + 1
			if (currentState !== targetState) {
				setCurrentState(targetState)
			}
		}
	}, [currentPage, numPages, isMobile])

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
			setCurrentPage(isMobile ? nextState - 1 : (nextState - 1) * 2)
		}
	}, [currentState, maxState, playFlipSound, setCurrentPage, isMobile])

	const handleFlipPrev = useCallback(() => {
		if (currentState > 1) {
			playFlipSound()
			const prevState = currentState - 1
			setCurrentState(prevState)
			setCurrentPage(isMobile ? prevState - 1 : (prevState - 1) * 2)
		}
	}, [currentState, playFlipSound, setCurrentPage, isMobile])

	useEffect(() => {
		document.body.classList.add('no-scroll')
		return () => document.body.classList.remove('no-scroll')
	}, [])
	const isClosedFront = currentState === 1
	const isClosedBack = currentState > numOfPapers
	const isOpen = currentState > 1 && currentState <= numOfPapers

	const bookTransform = isMobile
		? 'none'
		: isClosedFront
			? 'translateX(0%)'
			: isClosedBack
				? 'translateX(100%)'
				: 'translateX(50%)'

	// Buttons slide outward when book is open
	const btnOffset = finalWidth / 2 + 24;
	const prevBtnTransform = isMobile ? 'none' : (isOpen
		? `translateX(-${btnOffset}px)`
		: 'translateX(0px)')

	const nextBtnTransform = isMobile ? 'none' : (isOpen
		? `translateX(${btnOffset}px)`
		: 'translateX(0px)')

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
						disableAutoFetch: true,
						disableStream: true,
					}}
				>
					{numPages > 0 &&
						Array.from({ length: numOfPapers }).map((_, paperIndex) => {
							const paperNumber = paperIndex + 1;
							const isVisible = Math.abs(paperNumber - currentState) <= 2;
							if (!isVisible) return null;
							const pageFront = isMobile ? paperIndex + 1 : paperIndex * 2 + 1;
							const pageBack = isMobile ? null : paperIndex * 2 + 2;
							const isFlipped = currentState > paperNumber
							const zIndex = isFlipped
								? paperNumber
								: numOfPapers * 2 - paperIndex
							const isInteractiveRight =
								paperNumber === currentState && currentState < maxState
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
								'--z-index': zIndex,
							} as React.CSSProperties

							return (
								<div
									key={`paper-${paperIndex}`}
									className={`paper${isFlipped ? ' flipped' : ''}${interactiveClass}`}
									style={paperStyle}
								>
									<div className="page-turner">
										<div className="front">
											{isInteractiveRight && (
												<>
													<button className="fold-zone fold-zone-top" onClick={paperOnClick} tabIndex={0} type="button" />
													<button className="fold-zone fold-zone-bottom" onClick={paperOnClick} tabIndex={0} type="button" />
												</>
											)}
											<div className={`front-content ${type}`}>
												<PageRander
													pageNumber={pageFront}
													width={finalWidth}
													height={finalHeight}
												/>
											</div>
										</div>
										<div className="back">
											{isInteractiveLeft && (
												<>
													<button className="fold-zone fold-zone-top" onClick={paperOnClick} tabIndex={0} type="button" />
													<button className="fold-zone fold-zone-bottom" onClick={paperOnClick} tabIndex={0} type="button" />
												</>
											)}
											<div className={`back-content ${type}`}>
												{pageBack && pageBack <= numPages ? (
													<PageRander
														pageNumber={pageBack}
														width={finalWidth}
														height={finalHeight}
													/>
												) : (
													<div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }} />
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
