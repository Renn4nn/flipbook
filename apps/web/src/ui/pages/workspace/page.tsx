'use client'

import type { ApiResponse, DocumentSchema } from '@repo/schemas'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import useApiResponse from '@/lib/api/hooks'
import styles from './workspace.module.css'
import LoadingSkeleton from '@/ui/components/skeletons/workspace/LoadingSkeleton/LoadingSkeleton'

export default function Workspace({
	documentsPromise
}: {
	documentsPromise: Promise<ApiResponse<DocumentSchema[]>>
}) {
	const ThumbnailPdf = dynamic(
		() => import('@/ui/components/thumbnail/ThumbnailPdf'),
		{
			ssr: false,
			loading: () => <div className={styles.loadingContainer}><LoadingSkeleton /></div>
		}
	)
	const documentsResponse = useApiResponse<DocumentSchema[]>(documentsPromise)
	if (!documentsResponse)
		return <div className={styles.container}>Não existe Documentos...</div>
	return (
		<article className={styles.container}>
			<div className={styles.grid}>
				{documentsResponse.map((document) => (
					<div key={document.id} className={styles.card}>
						<div className={styles.cardHeader}>
							<h3 title={document.filename}>{document.filename}</h3>
							<span>
								{new Intl.DateTimeFormat('pt-BR', {
									day: '2-digit',
									month: 'long',
									year: 'numeric'
								}).format(new Date(document.createdAt))}
							</span>
						</div>
						<Link
							href={`/view/${document.id}`}
							className={styles.cardBody}
						>
							<ThumbnailPdf
								url={`http://localhost:3001${document.path}`}
								className={styles.cardImage}
							/>
						</Link>
					</div>
				))}
			</div>
		</article>
	)
}
