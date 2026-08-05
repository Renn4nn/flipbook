'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { useFlipbookStore } from '@/lib/store/useFlipbook'
import { useFullscreenStore } from '@/lib/store/useFullScreen'
import PageLoadingSkeleton from '@/ui/components/skeletons/library/PageLoadingSkeleton/PageLoadingSkeleton'
import Slider from '@/ui/components/slider/Slider'
import { FlipbookToolbar } from './components'
import { BackButton } from './components/BackButton'
import styles from './flipbook-layout.module.css'

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <PageLoadingSkeleton />
})

interface FlipBookViewerProps {
	file: File | string
	showBackButton?: boolean
	embedded?: boolean
}

export default function FlipBookViewer({
	file,
	showBackButton = false,
	embedded = false
}: FlipBookViewerProps) {
	const { reset } = useFlipbookStore()
	const { isFullscreen, toggleFullscreen, setFullscreen } = useFullscreenStore()

	useEffect(() => {
		reset()
	}, [reset])

	useEffect(() => {
		const handleFullscreenChange = () => {
			setFullscreen(Boolean(document.fullscreenElement))
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange)
		return () =>
			document.removeEventListener('fullscreenchange', handleFullscreenChange)
	}, [setFullscreen])

	const containerClass =
		embedded && !isFullscreen
			? styles.previewGridContainer
			: styles.gridContainer

	return (
		<div className={containerClass}>
			<div className={styles.flipbookArea}>
				<TransformWrapper
					initialScale={1}
					minScale={1}
					maxScale={4}
					centerOnInit
					centerZoomedOut
					limitToBounds
					doubleClick={{ disabled: true }}
				>
					{({ zoomIn, zoomOut }) => (
						<div className={styles.transformContainer}>
							{showBackButton && <BackButton />}
							<FlipbookToolbar
								isFullscreen={isFullscreen}
								embedded={embedded && !isFullscreen}
								onToggleFullscreen={toggleFullscreen}
								onZoomIn={() => zoomIn(0.4, 300, 'easeOut')}
								onZoomOut={() => zoomOut(0.4, 300, 'easeOut')}
							/>

							<TransformComponent
								wrapperStyle={{ width: '100%', height: '100%' }}
								contentStyle={{
									width: '100%',
									height: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<FlipBook
									type="magazine"
									file={file}
									width={500}
									height={665}
									embedded={embedded && !isFullscreen}
								/>
							</TransformComponent>
						</div>
					)}
				</TransformWrapper>
			</div>

			<div className={styles.sliderArea}>
				<Slider />
			</div>
		</div>
	)
}
