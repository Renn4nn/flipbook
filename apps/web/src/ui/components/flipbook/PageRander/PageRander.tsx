import { useEffect, useRef, useState } from 'react'
import { Page } from 'react-pdf'
import { ErrorBoundary } from '@/lib/error-boundary/ErrorBoundary'
import { PageSkeleton } from '../../skeletons/library/PageSkeleton/PageSkeleton'

interface PageRanderProps {
	pageNumber: number
	width: number
	height: number
	zoomScale?: number
}

export const PageRander = ({
	pageNumber,
	width,
	height,
	zoomScale = 1
}: PageRanderProps) => {
	const [isRendered, setIsRendered] = useState(false)
	const isMounted = useRef(true)

	useEffect(() => {
		isMounted.current = true
		return () => {
			isMounted.current = false
		}
	}, [])

	const handleRenderSuccess = () => {
		if (isMounted.current) {
			setIsRendered(true)
		}
	}

	// O zoom visual usa CSS; renderizar novamente em uma escala proporcional
	// preserva a nitidez do texto vetorial sem deixar o canvas ilimitado.
	const renderScale = Math.min(Math.max(zoomScale * 1.5, 1.75), 3)
	const devicePixelRatio = Math.min(
		typeof window !== 'undefined'
			? Math.max(window.devicePixelRatio, 1.5)
			: 1.5,
		2
	)

	return (
		<div style={{ position: 'relative', width, height }}>
			{!isRendered && (
				<div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
					<PageSkeleton width={width} height={height} />
				</div>
			)}
			<div
				style={{
					opacity: isRendered ? 1 : 0,
					transition: 'opacity 0.3s ease-in-out',
					width: '100%',
					height: '100%'
				}}
			>
				<ErrorBoundary
					fallback={<PageSkeleton width={width} height={height} />}
				>
					<Page
						key={`page_${pageNumber}_${renderScale}`}
						width={width}
						scale={renderScale}
						pageNumber={pageNumber}
						devicePixelRatio={devicePixelRatio}
						renderAnnotationLayer={false}
						renderTextLayer={false}
						canvasBackground="#ffffff"
						loading={<div style={{ width, height }} />}
						error={<PageSkeleton width={width} height={height} />}
						onRenderSuccess={handleRenderSuccess}
						onRenderError={(err) => {
							if (err.message.includes('destroyed') || !isMounted.current)
								return
							console.error('Erro real de renderização:', err)
						}}
						renderMode={'canvas'}
					/>
				</ErrorBoundary>
			</div>
		</div>
	)
}
