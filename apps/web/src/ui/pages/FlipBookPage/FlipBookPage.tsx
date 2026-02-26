'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { CreateBookButton } from '@/ui/components/file-picker/CreateDocButton'
import FilePicker from '@/ui/components/file-picker/FilePicker'
import type { FlipBookType } from '../../components/flipbook/type'
import styles from './flipbook-page.module.css'

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <p>Carregando leitor...</p>
})

export default function FlipBookPage() {
	const [file, setFile] = useState<File | null>(null)
	const [type, setType] = useState<FlipBookType>('magazine')

	return (
		<div className={styles.wrapper}>
			<FilePicker file={file} setFile={setFile} />
			{file && (
				<>
					<CreateBookButton file={file} />
					<FlipBook type={type} file={file} />
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
				</>
			)}
		</div>
	)
}
