"use client"

import { useModalStore } from '@/lib/store/useModal'
import styles from './modal.module.css'

type ModalProps = {
  children: React.ReactNode;
}
export default function Modal({ children }: ModalProps) {
	const { isOpen, closeModal } = useModalStore();

	if (!isOpen) return null;

	return (
		<div className={styles.overlay}>
      <div className={styles.content}>
        <button type="button" className={styles.closeBtn} onClick={closeModal} />
				{children}
      </div>
    </div>
	)
}