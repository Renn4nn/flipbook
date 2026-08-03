'use client'

import type { ApiResponse, DocumentSchema } from '@repo/schemas'
import dynamic from 'next/dynamic'
import { memo, useEffect } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import useApiResponse from '@/lib/api/hooks'
import { useFlipbookStore } from '@/lib/store/useFlipbook'
import { useFullscreenStore } from '@/lib/store/useFullScreen'
import PageLoadingSkeleton from '@/ui/components/skeletons/library/PageLoadingSkeleton/PageLoadingSkeleton'
import Slider from '@/ui/components/slider/Slider'
import { FlipbookToolbar } from './components'
import { BackButton } from './components/BackButton'
import styles from './flipbook-layout.module.css'

interface FlipBookLayoutProps {
	documentPromise: Promise<ApiResponse<DocumentSchema>>
}

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <PageLoadingSkeleton />
})

const FlipBookLayout = memo(function FlipBookLayout({
	documentPromise
}: FlipBookLayoutProps) {
	const { reset } = useFlipbookStore()
	const { isFullscreen, toggleFullscreen, setFullscreen } = useFullscreenStore()
	const data = useApiResponse<DocumentSchema>(documentPromise)

	useEffect(() => {
		reset()
	}, [reset])

	useEffect(() => {
		const handleFullscreenChange = () => {
			setFullscreen(!!document.fullscreenElement)
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange)
		return () =>
			document.removeEventListener('fullscreenchange', handleFullscreenChange)
	}, [setFullscreen])

	if (!data) {
		return (
			<div className={styles.errorContainer}>
				<p>Documento não encontrado.</p>
			</div>
		)
	}

	return (
		<div className={styles.gridContainer}>
			<div className={styles.flipbookArea}>
				<TransformWrapper
					initialScale={1}
					minScale={1}
					maxScale={4}
					centerOnInit
					centerZoomedOut
					limitToBounds={true}
					doubleClick={{ disabled: true }}
				>
					{({ zoomIn, zoomOut }) => (
						<div className={styles.transformContainer}>
							<BackButton />
							<FlipbookToolbar
								isFullscreen={isFullscreen}
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
									file={`http://localhost:3001${data.path}`}
									width={500}
									height={665}
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
})

export default FlipBookLayout
