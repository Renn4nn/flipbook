"use client"

import { useModalStore } from '@/lib/store/useModal'
import styles from './modal.module.css'

export default function Modal() {
	const { isOpen, closeModal } = useModalStore();

	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={closeModal}>
      <div className={styles.content}>
        <button type="button" className={styles.closeBtn} onClick={closeModal} />
      </div>
    </div>
	)
}