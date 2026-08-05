'use client'
import { Logo } from '@repo/ui/logo'
import Link from 'next/link'
import { useState } from 'react'
import { useFullscreenStore } from '@/lib/store/useFullScreen'
import FilePicker from '@/ui/components/file-picker/FilePicker'
import FlipBookLayoutPreview from '@/ui/layout/FlipBookLayout/FlipBookLayoutPreview'
import styles from './page.module.css'

export default function LandingPage() {
	const [file, setFile] = useState<File | null>(null)
	const { isFullscreen } = useFullscreenStore()
	return (
		<div className={styles.landingContainer}>
			<header
				className={`${styles.header} ${isFullscreen ? styles.hidden : ''}`}
			>
				<div className={styles.headerContent}>
					<Logo />
					<div className={styles.headerText}>
						<h1>CTD Flipbook</h1>
						<p>Visualize seus documentos de forma interativa e moderna</p>
					</div>
				</div>
				{file && (
					<div className={styles.headerActions}>
						<span className={styles.fileName} title={file.name}>
							{file.name}
						</span>
						<button
							type="button"
							className={styles.removeButton}
							onClick={() => setFile(null)}
						>
							Trocar PDF
						</button>
						<Link href="/login" className={styles.loginButton}>
							Entrar
						</Link>
					</div>
				)}
				{!file && (
					<Link href="/login" className={styles.loginButton}>
						Entrar
					</Link>
				)}
			</header>

			<main
				className={`${styles.main} ${file ? styles.previewMain : ''} ${isFullscreen ? styles.fullscreenMain : ''}`}
			>
				{!file ? (
					<div className={styles.uploadPanel}>
						<FilePicker file={file} setFile={setFile} />
					</div>
				) : (
					<FlipBookLayoutPreview file={file} />
				)}
			</main>

			<footer
				className={`${styles.footer} ${isFullscreen ? styles.hidden : ''}`}
			>
				<p>CTD - Companhia de Tecnologia e Desenvolvimento</p>
			</footer>
		</div>
	)
}
