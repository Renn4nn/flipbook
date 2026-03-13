import { useEffect, useState } from 'react'
import { useFlipbookStore } from '@/lib/store/useFlipbook'
import styles from './slider.module.css'

export default function Slider() {
	const { currentPage, totalPages, goToPage } = useFlipbookStore()
	const [showIndicator, setShowIndicator] = useState(false)
	const [localValue, setLocalValue] = useState(currentPage)

	useEffect(() => {
		setLocalValue(currentPage)
	}, [currentPage])

	const getPageLabel = () => {
		if (localValue === 0) return '1'
		if (totalPages % 2 === 0) {
			const firstPage = localValue + 1
			const secondPage = firstPage + 1
			return secondPage >= totalPages - 1
				? `${totalPages - 1}`
				: `${firstPage}-${secondPage}`
		}
		const firstPage = localValue + 1
		const secondPage = firstPage + 1
		return secondPage >= totalPages
			? `${totalPages}`
			: `${firstPage}-${secondPage}`
	}

	return (
		<>
			<div
				className={`${styles.pageIndicator} ${showIndicator ? styles.visible : ''}`}
				style={{
					left:
						totalPages > 0
							? `calc(${(localValue / totalPages) * 100}% + ${34 - (localValue / totalPages) * 68}px)`
							: '34px'
				}}
			>
				{getPageLabel()}
			</div>
			<input
				type="range"
				min="0"
				max={totalPages - 1}
				step="1"
				value={localValue}
				onChange={(e) => {
					let val = parseInt(e.target.value, 10)
					if (val > 0 && val < totalPages - 1 && val % 2 === 0) {
						val = val - 1
					}
					setLocalValue(val)
				}}
				onMouseDown={() => setShowIndicator(true)}
				onMouseUp={() => {
					goToPage(localValue)
					setShowIndicator(false)
				}}
				onTouchStart={() => setShowIndicator(true)}
				onTouchEnd={() => {
					goToPage(localValue)
					setShowIndicator(false)
				}}
				className={styles.pageSlider}
				disabled={totalPages === 0}
			/>
		</>
	)
}
