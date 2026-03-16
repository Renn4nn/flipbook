'use client'
import styles from './page.module.css'

export default function LandingPage() {
	return (
		<div className={styles.landingContainer}>
			<section className={styles.hero}>
				<h1>CTD Documents</h1>
				<p>Visualize seus documentos de forma interativa e moderna</p>
			</section>

			<section className={styles.previewSection}>
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<h3>Preview</h3>
						<span>Documento de exemplo</span>
					</div>
					<div className={styles.cardBody}>
						<div className={styles.cardPlaceholder}>DOC</div>
					</div>
				</div>
			</section>

			<section className={styles.ctaSection}>
				<a href="/workspace" className={styles.ctaButton}>
					Acessar Workspace
				</a>
			</section>
		</div>
	)
}
