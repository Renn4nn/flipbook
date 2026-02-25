'use client'

import styles from './file-picker.module.css'
import useFilePicker from './hooks/useFilePicker'
import DropZone from './modules/drop-zone/DropZone'
import type { FilePickerProps } from './types/components'
import { useEffect } from 'react'

export default function FilePicker({ file, setFile }: FilePickerProps) {
	const { clearFile, ...dropZoneProps } = useFilePicker({
		setFile
	})

	return (
		<div className={styles.wrapper}>
			{!file && <DropZone {...dropZoneProps} />}
			{file && (
				<div className={styles.item}>
					<span>{file.name}</span>
					<button
						className={styles['remove-button']}
						type="button"
						title="unselect file"
						onClick={clearFile}
					>
						X
					</button>
				</div>
			)}
		</div>
	)
}
