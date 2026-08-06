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
	const [tempSpread, setTempSpread] = useState(() =>
		PAGE_TO_SPREAD(currentPage)
	)

	const totalSpreads = useMemo(
		() => Math.floor(totalPages / 2) + 1,
		[totalPages]
	)

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

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newSpread = Number.parseInt(e.target.value, 10)
			setTempSpread(newSpread)

			// Teclado não dispara pointer events; nesse caso a navegação é imediata.
			if (!isDragging) {
				goToPage(newSpread * 2)
			}
		},
		[goToPage, isDragging]
	)

	const handleCommit = useCallback(() => {
		const pageIndex = tempSpread * 2
		goToPage(pageIndex)
		setIsDragging(false)
	}, [tempSpread, goToPage])

	const handleStart = useCallback(() => {
		setIsDragging(true)
	}, [])

	if (totalPages === 0) return null

	return (
		<div className={styles.sliderWrapper}>
			<output
				className={styles.pageIndicator}
				htmlFor="page-navigation"
				aria-live="polite"
			>
				{spreadLabel}
				<span aria-hidden="true">/</span>
				<span className={styles.totalPages}>{totalPages}</span>
			</output>
			<input
				id="page-navigation"
				type="range"
				min={0}
				max={Math.max(0, totalSpreads - 1)}
				value={tempSpread}
				onPointerDown={handleStart}
				onChange={handleChange}
				onPointerUp={handleCommit}
				onPointerCancel={handleCommit}
				onBlur={handleCommit}
				className={styles.pageSlider}
				style={
					{ '--progress': `${progressPercentage}%` } as React.CSSProperties
				}
				aria-label="Navegar entre páginas"
				aria-valuetext={`Página ${spreadLabel} de ${totalPages}`}
			/>
		</div>
	)
})

export default Slider
