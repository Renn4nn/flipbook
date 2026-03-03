'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { CreateBookButton } from '@/ui/components/file-picker/modules/createbutton/CreateDocButton'
import type { FlipBookType } from '@/ui/components/flipbook/type'
import styles from './flipbook-page.module.css'

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <p>Carregando leitor...</p>
})

export default function FlipBookPage({ id }: { id: string }) {
	const [type, setType] = useState<FlipBookType>('magazine')

	return (
		<div className={styles.wrapper}>
			<FlipBook type={type} file={`http://localhost:3001/uploads/${id}`} />
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
