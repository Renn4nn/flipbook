import { ArrowBigLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFullscreenStore } from '@/lib/store/useFullScreen'
import styles from './backbutton.module.css'

export function BackButton() {
	const router = useRouter()
	const exitFullscreen = useFullscreenStore((state) => state.exitFullscreen)

	async function handleBackClick() {
		await exitFullscreen()
		router.push('/library')
	}

	return (
		<div className={styles.backButtonContainer}>
			<button
				onClick={handleBackClick}
				className={styles.backButton}
				aria-label="Voltar"
				type="button"
			>
				<ArrowBigLeft />
			</button>
		</div>
	)
}
