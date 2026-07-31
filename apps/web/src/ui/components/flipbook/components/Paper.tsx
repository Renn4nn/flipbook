'use client'

import { memo } from 'react'
import { PageRander } from '../PageRander/PageRander'

interface PaperProps {
	paperIndex: number
	currentState: number
	maxState: number
	numOfPapers: number
	pageFront: number
	pageBack: number | null
	numPages: number
	finalWidth: number
	finalHeight: number
	type: string
	onFlipNext: () => void
	onFlipPrev: () => void
}

export const Paper = memo(function Paper({
	paperIndex,
	currentState,
	maxState,
	numOfPapers,
	pageFront,
	pageBack,
	numPages,
	finalWidth,
	finalHeight,
	type,
	onFlipNext,
	onFlipPrev
}: PaperProps) {
	const paperNumber = paperIndex + 1
	const isFlipped = currentState > paperNumber
	const zIndex = isFlipped ? paperNumber : numOfPapers * 2 - paperIndex

	const isInteractiveRight =
		paperNumber === currentState && currentState < maxState
	const isInteractiveLeft = paperNumber === currentState - 1

	const handleClick = isInteractiveRight
		? onFlipNext
		: isInteractiveLeft
			? onFlipPrev
			: undefined

	const interactiveClass = isInteractiveRight
		? ' interactive-right'
		: isInteractiveLeft
			? ' interactive-left'
			: ''

	const paperStyle = { '--z-index': zIndex } as React.CSSProperties

	return (
		<div
			key={`paper-${paperIndex}`}
			className={`paper${isFlipped ? ' flipped' : ''}${interactiveClass}`}
			style={paperStyle}
		>
			<div className="page-turner">
				<div className="front">
					{isInteractiveRight && (
						<>
							<button
								className="fold-zone fold-zone-top"
								onClick={handleClick}
								tabIndex={0}
								type="button"
								aria-label="Virar página"
							/>
							<button
								className="fold-zone fold-zone-bottom"
								onClick={handleClick}
								tabIndex={0}
								type="button"
								aria-label="Virar página"
							/>
						</>
					)}
					<div className={`front-content ${type}`}>
						<PageRander
							pageNumber={pageFront}
							width={finalWidth}
							height={finalHeight}
						/>
					</div>
				</div>
				<div className="back">
					{isInteractiveLeft && (
						<>
							<button
								className="fold-zone fold-zone-top"
								onClick={handleClick}
								tabIndex={0}
								type="button"
								aria-label="Voltar página"
							/>
							<button
								className="fold-zone fold-zone-bottom"
								onClick={handleClick}
								tabIndex={0}
								type="button"
								aria-label="Voltar página"
							/>
						</>
					)}
					<div className={`back-content ${type}`}>
						{pageBack && pageBack <= numPages ? (
							<PageRander
								pageNumber={pageBack}
								width={finalWidth}
								height={finalHeight}
							/>
						) : (
							<div
								style={{
									width: '100%',
									height: '100%',
									backgroundColor: '#fff'
								}}
								aria-hidden="true"
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
})
