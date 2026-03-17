'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { FlipBookType } from '@/ui/components/flipbook/type'
import Slider from '@/ui/components/slider/Slider'
import styles from './flipbook-page.module.css'
import { Button } from '@repo/ui/button'
type DocumentProps = {
	file: File
}

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <p>Carregando leitor...</p>
})
export default function FlipBookPage({ file }: DocumentProps) {
	const [type] = useState<FlipBookType>('magazine')

	return (
		<div className={styles.wrapperEmbedded}>
			<div className={styles.flipbookContainer}>
				<div className={styles.fullscreenWrapper}>
					<Button onClick={() => console.log('FULLSCREEN')}>
						<span>fullscreen</span>
					</Button>
				</div>
				<FlipBook type={type} file={file} width={500} height={665} />
			</div>

			<div className={styles.sliderContainer}>
				<Slider />
			</div>
		</div>
	)
}
