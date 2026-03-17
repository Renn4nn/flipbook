'use client'

import { Upload } from 'lucide-react'
import type { DropZoneProps } from '../../types/components'
import styles from './drop-zone.module.css'

export default function DropZone({
	fileInputRef,
	handleClick,
	handleDragOver,
	handleDrop,
	fileInputHandleChange,
	handleKeyDown
}: DropZoneProps) {
	return (
		<button
			type="button"
			className={styles['drop-zone']}
			onClick={handleClick}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onKeyDown={handleKeyDown}
		>
			<div className={styles.banner}>
				<Upload className={styles.icon} />
				<span>
					<b>Clique</b> aqui
				</span>
				<span>ou</span>
				<span>
					<b>Arraste</b> arquivos
				</span>
			</div>
			<input
				ref={fileInputRef}
				type="file"
				multiple={false}
				accept=".pdf"
				onChange={fileInputHandleChange}
				style={{ display: 'none' }}
			/>
		</button>
	)
}
