'use client'

import useApiResponse from '@/lib/api/hooks'
import styles from './workspace.module.css'
import Image from 'next/image'
import { ApiResponse, DocumentSchema } from '@repo/schemas'
import Link from 'next/link'
import ThumbnailPdf from '@/ui/components/ThumbnailPdf'
import dynamic from 'next/dynamic'

export default function Workspace({
	documentsPromise
}: {
	documentsPromise: Promise<ApiResponse<DocumentSchema[]>>
}) {
	
	const ThumbnailPdf = dynamic(() => import('@/ui/components/ThumbnailPdf'), { 
		ssr: false,
		loading: () => <div style={{ height: '350px', background: '#222', borderRadius: '8px' }} />
	})
	const documentsResponse = useApiResponse<DocumentSchema[]>(documentsPromise)
	if (!documentsResponse)
		return <div className={styles.container}>Carregando documentos...</div>
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
							href={`/flipbook/${document.id}.pdf`}
							className={styles.cardBody}
						>
							<ThumbnailPdf 
                url={`http://localhost:3001${document.path}`}
              />
						</Link>
					</div>
				))}
			</div>
		</article>
	)
}
