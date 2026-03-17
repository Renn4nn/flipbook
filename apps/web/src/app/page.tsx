'use client'
import styles from './page.module.css'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Logo } from '@repo/ui/logo'
import FilePicker from '@/ui/components/file-picker/FilePicker'
import FlipBookPagePreview from '@/ui/pages/FlipBookPage/FlipBookPagePreview'

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <div className={styles.loading}>Carregando preview...</div>
})

export default function LandingPage() {
	const [file, setFile] = useState<File | null>(null)

	return (
		<div className={styles.landingContainer}>
			<header className={styles.header}>
				<div className={styles.headerContent}>
					<Logo />
					<div className={styles.headerText}>
						<h1>CTD Flipbook</h1>
						<p>Visualize seus documentos de forma interativa e moderna</p>
					</div>
				</div>
				{file && (
					<button
						type="button"
						className={styles.removeButton}
						onClick={() => setFile(null)}
					>
						Remover arquivo
					</button>
				)}
			</header>

			<main className={styles.main}>
				{!file ? (
					<FilePicker file={file} setFile={setFile} />
				) : (
					<FlipBookPagePreview file={file} />
				)}
			</main>

			<footer className={styles.footer}>
				<p> 2026 CTD Flipbook. Todos os direitos reservados.</p>
			</footer>
		</div>
	)
}
