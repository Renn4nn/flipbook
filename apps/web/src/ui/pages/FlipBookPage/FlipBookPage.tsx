'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { FlipBookType } from '@/ui/components/flipbook/type'
import styles from './flipbook-page.module.css'

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <p>Carregando leitor...</p>
})

export default function FlipBookPage({ path }: { path: string }) {
	const [type] = useState<FlipBookType>('magazine')

	if (!path || path === '') {
		return null
	}

	return (
		<div className={styles.wrapper}>
			<FlipBook
				type={type}
				file={`http://localhost:3001${path}`}
				width={500}
				height={665}
			/>
		</div>
	)
}
