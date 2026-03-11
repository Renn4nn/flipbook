	import { useState, useEffect } from 'react'
	import { useFlipbookStore } from '@/lib/store/useFlipbook'
	import styles from './slider.module.css'

export default function Slider() {
	const { currentPage, totalPages, goToPage } = useFlipbookStore()
	const [showIndicator, setShowIndicator] = useState(false)

	const [localValue, setLocalValue] = useState(currentPage)
  useEffect(() => {
    setLocalValue(currentPage)
  }, [currentPage])

	const handleCommit = async (value: string) => {
    const pageIndex = parseInt(value, 10)
    goToPage(pageIndex)
    setShowIndicator(false)
  }

	const getPageLabel = () => {
  if (localValue === 0) return "1";
  if (localValue === totalPages) {
    return `${totalPages * 2}`; 
  }
  const firstInPair = localValue * 2;
  const secondInPair = firstInPair + 1;
  return `${firstInPair}-${secondInPair}`;
};

  return(
    <>
        <div
					className={`${styles.pageIndicator} ${showIndicator ? styles.visible : ''}`}
					style={{
    					left: totalPages > 0 
      					? `calc(${ (localValue / totalPages) * 100 }% + ${ 34 - (localValue / totalPages) * 68 }px)`
      					: '34px'
  					}}
				>
					{getPageLabel()}
				</div>
				<input

					type="range"
					min="0"
					max={totalPages}
					value={localValue}
					onChange={(e) => setLocalValue(parseInt(e.target.value, 10))}
					onMouseDown={() => setShowIndicator(true)}
					onMouseUp={() => handleCommit(localValue.toString())}
					onTouchStart={() => setShowIndicator(true)}
					onTouchEnd={() => handleCommit(localValue.toString())}
					onMouseLeave={() => setShowIndicator(false)}
					className={styles.pageSlider}
					disabled={totalPages === 0}
				/>
    </>
  ) 
}
