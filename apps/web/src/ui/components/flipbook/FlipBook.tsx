'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, pdfjs } from 'react-pdf'
import { useFlipbookStore } from '@/lib/store/useFlipbook'
import LoadingSkeleton from '@/ui/components/skeletons/workspace/LoadingSkeleton/LoadingSkeleton'
import { FlipButton } from './components/FlipButton'
import { Paper } from './components/Paper'
import { useContainerSize, useFlipbookAudio, useMediaQuery } from './hooks'
import type { FlipBookType } from './type'
import './styles.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const ASPECT_RATIO = 0.70796
const MOBILE_BREAKPOINT = 900
const DEFAULT_MAX_WIDTH = 500
const DEFAULT_MAX_HEIGHT = 700

interface FlipBookProps {
	type?: FlipBookType
	file: File | string
	width?: number
	height?: number
}

const FlipBook = memo(function FlipBook({
	file,
	type = 'magazine',
	width = DEFAULT_MAX_WIDTH,
	height = DEFAULT_MAX_HEIGHT
}: FlipBookProps) {
	const bookRef = useRef<HTMLDivElement>(null)
	const isMobile = useMediaQuery(MOBILE_BREAKPOINT)
	const { setCurrentPage, setTotalPages, currentPage } = useFlipbookStore()
	const { play: playFlipSound } = useFlipbookAudio()

	const [numPages, setNumPages] = useState(0)
	const [currentState, setCurrentState] = useState(1)

	// Usar container size para dimensões responsivas
	const containerSize = useContainerSize(bookRef, width, height)

	// Memoizar dimensões finais (container size ou mobile)
	const dimensions = useMemo(() => {
		if (isMobile) {
			const screenWidth =
				typeof window !== 'undefined' ? window.innerWidth : 1200
			const calculatedWidth = Math.min(340, screenWidth - 24)
			return {
				width: calculatedWidth,
				height: Math.round(calculatedWidth / ASPECT_RATIO)
			}
		}
		return containerSize
	}, [isMobile, containerSize])

	// Calcular número de papers e estado máximo
	const { numOfPapers, maxState } = useMemo(() => {
		const papers = isMobile ? numPages : Math.ceil(numPages / 2)
		const max =
			numPages > 0
				? isMobile
					? numPages
					: numPages % 2 === 0
						? papers + 1
						: papers
				: 1
		return { numOfPapers: papers, maxState: max }
	}, [numPages, isMobile])

	// Sincronizar estado com currentPage do store
	useEffect(() => {
		if (currentPage >= 0 && numPages > 0) {
			const targetState = isMobile
				? currentPage + 1
				: Math.floor(currentPage / 2) + 1
			if (currentState !== targetState) {
				setCurrentState(targetState)
			}
		}
	}, [currentPage, numPages, isMobile, currentState])

	const handleDocumentLoad = useCallback(
		({ numPages }: { numPages: number }) => {
			setNumPages(numPages)
			setTotalPages(numPages)
		},
		[setTotalPages]
	)

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

	// Calcular transformações do book e botões
	const bookTransform = useMemo(() => {
		if (isMobile) return 'none'
		if (currentState === 1) return 'translateX(0%)'
		if (currentState > numOfPapers) return 'translateX(100%)'
		return 'translateX(50%)'
	}, [isMobile, currentState, numOfPapers])

	const { prevBtnTransform, nextBtnTransform } = useMemo(() => {
		if (isMobile) return { prevBtnTransform: 'none', nextBtnTransform: 'none' }

		const isOpen = currentState > 1 && currentState <= numOfPapers
		const btnOffset = dimensions.width / 2 + 24

		return {
			prevBtnTransform: isOpen
				? `translateX(-${btnOffset}px)`
				: 'translateX(0px)',
			nextBtnTransform: isOpen
				? `translateX(${btnOffset}px)`
				: 'translateX(0px)'
		}
	}, [isMobile, currentState, numOfPapers, dimensions.width])

	// Bloquear scroll do body
	useEffect(() => {
		document.body.classList.add('no-scroll')
		return () => document.body.classList.remove('no-scroll')
	}, [])

	const pdfOptions = useMemo(
		() => ({
			cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
			cMapPacked: true,
			standardFontDataUrl: 'standard_fonts/'
		}),
		[]
	)

	// Memoizar array de papers visíveis
	const visiblePapers = useMemo(() => {
		if (numPages === 0) return []

		return Array.from(
			{ length: numOfPapers },
			(_, paperIndex) => paperIndex + 1
		).map((paperNumber) => {
			const paperIndex = paperNumber - 1
			const isVisible = Math.abs(paperNumber - currentState) <= 2

			if (!isVisible) return null

			const pageFront = isMobile ? paperIndex + 1 : paperIndex * 2 + 1
			const pageBack = isMobile ? null : paperIndex * 2 + 2

			return (
				<Paper
					key={`paper-${paperNumber}`}
					paperIndex={paperIndex}
					currentState={currentState}
					maxState={maxState}
					numOfPapers={numOfPapers}
					pageFront={pageFront}
					pageBack={pageBack}
					numPages={numPages}
					finalWidth={dimensions.width}
					finalHeight={dimensions.height}
					type={type}
					onFlipNext={handleFlipNext}
					onFlipPrev={handleFlipPrev}
				/>
			)
		})
	}, [
		numPages,
		numOfPapers,
		currentState,
		isMobile,
		dimensions,
		type,
		maxState,
		handleFlipNext,
		handleFlipPrev
	])

	return (
		<div className="custom-flipbook-container">
			<FlipButton
				direction="prev"
				onClick={handleFlipPrev}
				disabled={currentState === 1}
				transform={prevBtnTransform}
			/>

			<div
				ref={bookRef}
				className="book"
				style={{
					width: dimensions.width,
					height: dimensions.height,
					transform: bookTransform
				}}
			>
				<Document
					className="book-document"
					file={file}
					onLoadSuccess={handleDocumentLoad}
					error="Um erro ocorreu!"
					loading={
						<div className="loading-container">
							<LoadingSkeleton />
						</div>
					}
					noData="Nenhum arquivo PDF selecionado"
					options={pdfOptions}
					scale={10}
				>
					{visiblePapers}
				</Document>
			</div>

			<FlipButton
				direction="next"
				onClick={handleFlipNext}
				disabled={currentState >= maxState}
				transform={nextBtnTransform}
			/>
		</div>
	)
})

export default FlipBook
