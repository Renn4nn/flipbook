	import { useState, useRef } from 'react'
	import { useFlipbookStore } from '@/lib/store/useFlipbook'
	import styles from './slider.module.css'

export default function Slider() {
	const { currentPage, totalPages, goToPage } = useFlipbookStore()
	const [showIndicator, setShowIndicator] = useState(false)
	const sliderRef = useRef<HTMLInputElement>(null)

  return(
    <>
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
    </>
  ) 
}
