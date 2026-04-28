'use client'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useFlipbookStore } from '@/lib/store/useFlipbook'
import styles from './slider.module.css'

const PAGE_TO_SPREAD = (pageIndex: number): number => {
	if (pageIndex === 0) return 0
	return Math.ceil(pageIndex / 2)
}

const Slider = memo(function Slider() {
	const { currentPage, totalPages, goToPage } = useFlipbookStore()
	const [isDragging, setIsDragging] = useState(false)
	const [tempSpread, setTempSpread] = useState(() => PAGE_TO_SPREAD(currentPage))

	const totalSpreads = useMemo(() => Math.floor(totalPages / 2) + 1, [totalPages])

	// Sincronizar tempSpread com currentPage imediatamente (para setas funcionarem)
	useEffect(() => {
		if (!isDragging) {
			setTempSpread(PAGE_TO_SPREAD(currentPage))
		}
	}, [currentPage, isDragging])

	// Calcular label da spread baseada na spread atual
	const spreadLabel = useMemo(() => {
		if (totalPages === 0) return '0'
		const leftPage = tempSpread === 0 ? 1 : tempSpread * 2
		const rightPage = leftPage + 1

		if (tempSpread === 0) return '1'
		if (rightPage > totalPages) return `${leftPage}`
		return `${leftPage}-${rightPage}`
	}, [tempSpread, totalPages])

	// Calcular porcentagem do progresso
	const progressPercentage = useMemo(() => {
		if (totalSpreads <= 1) return 0
		return (tempSpread / (totalSpreads - 1)) * 100
	}, [tempSpread, totalSpreads])

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const newSpread = parseInt(e.target.value, 10)
		setTempSpread(newSpread)
	}, [])

	const handleCommit = useCallback(() => {
		const pageIndex = tempSpread === 0 ? 0 : tempSpread * 2 - 1
		goToPage(pageIndex)
		setIsDragging(false)
	}, [tempSpread, goToPage])

	const handleStart = useCallback(() => {
		setIsDragging(true)
	}, [])

	if (totalPages === 0) return null

	return (
		<div className={styles.sliderWrapper}>
			<div className={styles.pageIndicator}>
				{spreadLabel}
			</div>
			<input
				type="range"
				min={0}
				max={Math.max(0, totalSpreads - 1)}
				value={tempSpread}
				onMouseDown={handleStart}
				onTouchStart={handleStart}
				onChange={handleChange}
				onMouseUp={handleCommit}
				onTouchEnd={handleCommit}
				className={styles.pageSlider}
				style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties}
				aria-label="Navegar entre páginas"
			/>
		</div>
	)
})

export default Slider
