'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { FlipBookType } from '@/ui/components/flipbook/type'
import styles from './flipbook-page.module.css'
import { ApiResponse, DocumentSchema } from '@repo/schemas'

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <p>Carregando leitor...</p>
})

export default function FlipBookPage({ path }: { path: string }) {
	const [type, setType] = useState<FlipBookType>('magazine')

	if (!path || path === '') {
		return null
	}

	return (
		<div className={styles.wrapper}>
			<FlipBook type={type} file={`http://localhost:3001${path}`} />
			<div className={styles['button-group']}>
				<button
					className={styles.button}
					type="button"
					onClick={() => setType('book')}
				>
					Livro
				</button>
				<button
					className={styles.button}
					type="button"
					onClick={() => setType('magazine')}
				>
					Revista
				</button>
			</div>
		</div>
	)
}
