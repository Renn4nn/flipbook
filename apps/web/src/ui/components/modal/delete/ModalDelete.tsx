'use client'

import Modal from '@/ui/components/modal/Modal'
import styles from './modal-delete.module.css'

type ModalDeleteProps = {
	onConfirm: () => void
	onCancel: () => void
	isDeleting: boolean
}

export default function ModalDelete({
	onConfirm,
	onCancel,
	isDeleting
}: ModalDeleteProps) {
	return (
		<Modal title="Excluir documento?" id="delete-document">
			<div className={styles.modalContent}>
				<p className={styles.message}>
					Tem certeza que deseja excluir este documento?
				</p>
				<div className={styles.modalActions}>
					<button
						type="button"
						onClick={onCancel}
						disabled={isDeleting}
						className={styles.cancelButton}
					>
						Cancelar
					</button>
					<button
						type="button"
						className={styles.confirmButton}
						onClick={onConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? 'Excluindo...' : 'Confirmar'}
					</button>
				</div>
			</div>
		</Modal>
	)
}
