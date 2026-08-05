'use client'

import { Expand, Maximize, ZoomIn, ZoomOut } from 'lucide-react'
import { memo } from 'react'
import styles from './toolbar.module.css'

interface FlipbookToolbarProps {
	isFullscreen: boolean
	embedded?: boolean
	onToggleFullscreen: () => void
	onZoomIn: () => void
	onZoomOut: () => void
}

export const FlipbookToolbar = memo(function FlipbookToolbar({
	isFullscreen,
	embedded = false,
	onToggleFullscreen,
	onZoomIn,
	onZoomOut
}: FlipbookToolbarProps) {
	return (
		<div
			className={`${styles.toolbar} ${embedded ? styles.embeddedToolbar : ''}`}
		>
			<button
				onClick={onToggleFullscreen}
				className={styles.toolbarButton}
				aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
				type="button"
			>
				{isFullscreen ? <Expand size={22} /> : <Maximize size={22} />}
			</button>

			<button
				onClick={() => onZoomIn()}
				className={styles.toolbarButton}
				aria-label="Aumentar zoom"
				type="button"
			>
				<ZoomIn size={22} />
			</button>

			<button
				onClick={() => onZoomOut()}
				className={styles.toolbarButton}
				aria-label="Diminuir zoom"
				type="button"
			>
				<ZoomOut size={22} />
			</button>
		</div>
	)
})
