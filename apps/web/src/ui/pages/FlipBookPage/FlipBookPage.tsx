'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { FlipBookType } from '@/ui/components/flipbook/type'
import styles from './flipbook-page.module.css'
import Slider from '@/ui/components/slider/Slider'
import { useFlipbookStore } from '@/lib/store/useFlipbook'

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <p>Carregando leitor...</p>
})
export default function FlipBookPage({ path }: { path: string }) {
	const {reset} = useFlipbookStore()
	const [type] = useState<FlipBookType>('magazine')

	useEffect(() => {
		reset()
	}, [reset, path])

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

			<div className={styles.sliderContainer}>
				<Slider />
			</div>
		</div>
	)
}
