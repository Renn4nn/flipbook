'use client'

import type { ApiResponse, DocumentSchema } from '@repo/schemas'
import { memo } from 'react'
import useApiResponse from '@/lib/api/hooks'
import FlipBookViewer from './FlipBookViewer'
import styles from './flipbook-layout.module.css'

interface FlipBookLayoutProps {
	documentPromise: Promise<ApiResponse<DocumentSchema>>
}

const FlipBookLayout = memo(function FlipBookLayout({
	documentPromise
}: FlipBookLayoutProps) {
	const data = useApiResponse<DocumentSchema>(documentPromise)

	if (!data) {
		return (
			<div className={styles.errorContainer}>
				<p>Documento não encontrado.</p>
			</div>
		)
	}

	return (
		<FlipBookViewer file={`/api/documents/${data.id}/file`} showBackButton />
	)
})

export default FlipBookLayout
