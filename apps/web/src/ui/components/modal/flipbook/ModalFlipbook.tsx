'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import FilePicker from '../../file-picker/FilePicker'
import { CreateBookButton } from '../../createbutton/CreateDocButton'
import type { FlipBookType } from '../../flipbook/type'
import styles from './modal-flipbook.module.css'
import PageLoadingSkeleton from '@/ui/components/skeletons/workspace/PageLoadingSkeleton/PageLoadingSkeleton'

// Import dinâmico para evitar erros de SSR com o canvas do PDF
const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => (
		<PageLoadingSkeleton />
	)
})

export default function ModalFlipbook() {
	const [file, setFile] = useState<File | null>(null)
	const [type, setType] = useState<FlipBookType>('magazine')

	return (
		<div className={styles.container}>
			<div
				className={`${styles.pickerSection} ${file !== null ? styles.pickerHidden : ''}`}
			>
				<FilePicker file={file} setFile={setFile} />
			</div>

			{file && (
				<>
					<div className={styles.previewWrapper}>
						<FlipBook type={type} file={file} />
					</div>

					<div className={styles.footer}>
						<div className={styles.typeSelection}>
							<button
								type="button"
								className={styles.button}
								style={{
									backgroundColor: type === 'magazine' ? '#003d70' : '#005ca9'
								}}
								onClick={() => setType('magazine')}
							>
								Revista
							</button>
							<button
								type="button"
								className={styles.button}
								style={{
									backgroundColor: type === 'book' ? '#003d70' : '#005ca9'
								}}
								onClick={() => setType('book')}
							>
								Livro
							</button>
						</div>

						<CreateBookButton file={file} />
					</div>
				</>
			)}
		</div>
	)
}
