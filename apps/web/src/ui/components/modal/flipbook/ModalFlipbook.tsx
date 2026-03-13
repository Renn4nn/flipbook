'use client'

import dynamic from 'next/dynamic' // Importante para componentes que usam window/document
import { useState } from 'react'
import FilePicker from '../../file-picker/FilePicker'
import { CreateBookButton } from '../../file-picker/modules/createbutton/CreateDocButton'
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
					{/* O Preview ocupa o topo/centro */}
					<div className={styles.previewWrapper}>
						<FlipBook type={type} file={file} />
					</div>

					{/* O Footer agora está fora do wrapper que tem overflow hidden */}
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

						{/* Certifique-se de que o componente renderiza um botão visível */}
						<CreateBookButton file={file} />
					</div>
				</>
			)}
		</div>
	)
}
