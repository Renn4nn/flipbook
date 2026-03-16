import { useState, useRef, useEffect, useCallback } from 'react'
import { useFlipbookStore } from '@/lib/store/useFlipbook'
import styles from './slider.module.css'

// Helper: convert page index to spread index
const pageToSpread = (pageIndex: number): number => {
	if (pageIndex === 0) return 0
	return Math.ceil(pageIndex / 2)
}

export default function Slider() {
	const { currentPage, totalPages, goToPage } = useFlipbookStore()
	const [isDragging, setIsDragging] = useState(false)
	const [tempSpread, setTempSpread] = useState(currentPage)
	const sliderRef = useRef<HTMLInputElement>(null)
	const [thumbPosition, setThumbPosition] = useState(0)

	const totalSpreads = Math.floor(totalPages / 2) + 1

	useEffect(() => {
		if (!isDragging) {
			setTempSpread(pageToSpread(currentPage))
		}
	}, [currentPage, isDragging])

	const calculateThumbPosition = useCallback(
		(spreadIndex: number) => {
			if (!sliderRef.current || totalSpreads <= 1) return 0
			const sliderWidth = sliderRef.current.offsetWidth
			const thumbWidth = window.innerWidth <= 900 ? 45 : 68
			const trackWidth = sliderWidth - thumbWidth
			const percentage = spreadIndex / (totalSpreads - 1)
			return percentage * trackWidth + thumbWidth / 2
		},
		[totalSpreads]
	)

	useEffect(() => {
		const position = calculateThumbPosition(tempSpread)
		setThumbPosition(position)
	}, [tempSpread, calculateThumbPosition])

	useEffect(() => {
		const handleResize = () => {
			const position = calculateThumbPosition(tempSpread)
			setThumbPosition(position)
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [tempSpread, calculateThumbPosition])

	const getSpreadLabel = (spreadIndex: number): string => {
		if (totalPages === 0) return '0'
		const leftPage = spreadIndex === 0 ? 1 : spreadIndex * 2
		const rightPage = leftPage + 1
		if (spreadIndex === 0) {
			return '1'
		}
		if (rightPage > totalPages) {
			return `${leftPage}`
		}
		return `${leftPage}-${rightPage}`
	}

	const handleMouseDown = () => {
		setIsDragging(true)
	}

	const handleTouchStart = () => {
		setIsDragging(true)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSpread = parseInt(e.target.value, 10)
		setTempSpread(newSpread)
	}

	const commitChange = () => {
		console.log('Committing change:', tempSpread)
		const pageIndex = tempSpread === 0 ? 0 : tempSpread * 2 - 1
		console.log('Converted to page index:', pageIndex)
		goToPage(pageIndex)
		setIsDragging(false)
	}

	const handleMouseUp = () => {
		commitChange()
	}

	const handleTouchEnd = () => {
		commitChange()
	}

	const handleMouseLeave = () => {
		if (!isDragging) {
			setTempSpread(pageToSpread(currentPage))
		}
	}

	if (totalPages === 0) return null

	return (
		<div className={styles.sliderWrapper}>
			<div
				className={`${styles.pageIndicator} ${isDragging ? styles.visible : ''}`}
				style={{
					left: `${thumbPosition}px`,
					transform: 'translateX(-50%)'
				}}
			>
				{getSpreadLabel(tempSpread)}
			</div>
			<input
				ref={sliderRef}
				type="range"
				min={0}
				max={Math.max(0, totalSpreads - 1)}
				value={tempSpread}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
				onChange={handleChange}
				onMouseUp={handleMouseUp}
				onTouchEnd={handleTouchEnd}
				onMouseLeave={handleMouseLeave}
				className={styles.pageSlider}
			/>
		</div>
	)
}
