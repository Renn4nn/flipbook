'use client'

import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import type { FlipBookType } from '@/ui/components/flipbook/type'
import styles from './flipbook-page.module.css'
import { useFlipbookStore } from '@/lib/store/useFlipbook'

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <p>Carregando leitor...</p>
})

export default function FlipBookPage({ path }: { path: string }) {
	const [type] = useState<FlipBookType>('magazine')
	const { currentPage, totalPages, goToPage } = useFlipbookStore()
	const [showIndicator, setShowIndicator] = useState(false)
	const sliderRef = useRef<HTMLInputElement>(null)

	if (!path || path === '') {
		return null
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.flipbookContainer}>
				<FlipBook
					type={type}
					file={`http://localhost:3001${path}`}
					width={500}
					height={665}
				/>
			</div>

			{/* SLIDER: SEPARAR EM UM COMPONENTE */}
			<div className={styles.sliderContainer}>
				<div
					className={`${styles.pageIndicator} ${showIndicator ? styles.visible : ''}`}
					style={{
						left: totalPages > 0 ? `${(currentPage / totalPages) * 100}%` : '0%'
					}}
				>
					{currentPage + 1}
				</div>
				<input
					ref={sliderRef}
					type="range"
					min="0"
					max={totalPages}
					value={currentPage}
					onChange={(e) => goToPage(parseInt(e.target.value, 10))}
					onMouseDown={() => setShowIndicator(true)}
					onMouseUp={() => setShowIndicator(false)}
					onTouchStart={() => setShowIndicator(true)}
					onTouchEnd={() => setShowIndicator(false)}
					onMouseLeave={() => setShowIndicator(false)}
					className={styles.pageSlider}
					disabled={totalPages === 0}
				/>
			</div>
		</div>
	)
}
