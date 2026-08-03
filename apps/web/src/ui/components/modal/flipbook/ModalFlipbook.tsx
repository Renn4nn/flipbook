'use client'

import { useState } from 'react'
import { CreateBookButton } from '../../createbutton/CreateDocButton'
import FilePicker from '../../file-picker/FilePicker'
import styles from './modal-flipbook.module.css'

export default function ModalFlipbook() {
	const [file, setFile] = useState<File | null>(null)
	const [isUploading, setIsUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)

	return (
		<div className={styles.container}>
			<div
				className={`${styles.pickerSection} ${file !== null ? styles.pickerHidden : ''}`}
			>
				<FilePicker file={file} setFile={setFile} />
			</div>

			{file && (
				<div className={styles.uploadSection}>
					{isUploading && (
						<div className={styles.progressContainer}>
							<div className={styles.progressLabel}>Enviando documento...</div>
							<div className={styles.progressBar}>
								<div
									className={styles.progressFill}
									style={{ width: `${uploadProgress}%` }}
								/>
							</div>
							<span className={styles.progressText}>{uploadProgress}%</span>
						</div>
					)}
					<div className={styles.footer}>
						<CreateBookButton
							file={file}
							setIsUploading={setIsUploading}
							setUploadProgress={setUploadProgress}
							disabled={isUploading}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
