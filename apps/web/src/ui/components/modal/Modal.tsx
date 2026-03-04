'use client'

import { useModalStore } from '@/lib/store/useModal'
import styles from './modal.module.css'

type ModalProps = {
	children: React.ReactNode
	title: string
}
export default function Modal({ children, title }: ModalProps) {
	const { isOpen, closeModal } = useModalStore()

	if (!isOpen) return null

	return (
		<div className={styles.overlay}>
			<div className={styles.content}>
				<div className={styles.modalHeader}>
					<span className={styles.modalTitle}>{title}</span>
					<button
						type="button"
						className={styles.closeBtn}
						onClick={closeModal}
					>
						X
					</button>
				</div>
				<div className={styles.lineBreak}></div>
				{children}
			</div>
		</div>
	)
}
