import Logo from '@/ui/layout/logo'
import styles from './page-loading-skeleton.module.css'

export default function PageLoadingSkeleton() {
	const text = 'CARREGANDO...'
	const letters = text.split('').map((char, index) => ({
		char,
		id: `${char}-${index}`,
		animationDelay: `${index * 0.1}s`
	}))

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.logoWrapper}>
					<Logo />
				</div>
				<div className={styles.brand}>
					{letters.map(({ char, id, animationDelay }) => (
						<span key={id} className={styles.letter} style={{ animationDelay }}>
							{char === ' ' ? '\u00A0' : char}
						</span>
					))}
				</div>
			</div>
		</div>
	)
}
