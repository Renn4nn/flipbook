'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic' // Importante para componentes que usam window/document
import FilePicker from '../../file-picker/FilePicker'
import type { FlipBookType } from '../../flipbook/type'
import styles from './modal-flipbook.module.css'

// Import dinâmico para evitar erros de SSR com o canvas do PDF
const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => (
		<div className={styles.loadingPreview}>Carregando preview...</div>
	)
})

export default function ModalFlipbook() {
	const [file, setFile] = useState<File | null>(null)
	// const [type, setType] = useState<FlipBookType>('magazine')
	const type = 'magazine'

	return (
		<div className={styles.container}>
			<div
				className={`${styles.pickerSection} ${file !== null ? styles.pickerHidden : ''}`}
			>
				<FilePicker file={file} setFile={setFile} />
			</div>

			{file && (
				<div className={styles.previewWrapper}>
					<FlipBook type={type} file={file} />
				</div>
			)}
		</div>
	)
}
