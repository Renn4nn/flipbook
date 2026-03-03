'use client'

import useApiResponse from '@/lib/api/hooks'
import styles from './workspace.module.css'
import Image from 'next/image'
import { ApiResponse, DocumentSchema } from '@repo/schemas'


export default function Workspace({ documentsPromise }: { documentsPromise: Promise<ApiResponse<DocumentSchema[]>> }) {
    const documentsResponse = useApiResponse<DocumentSchema[]>(documentsPromise)
    if (!documentsResponse) return <div className={styles.container}>Carregando documentos...</div>
	return (
		<article className={styles.container}>
			<div className={styles.grid}>
				{documentsResponse.map((document) => (
						<div key={document.id} className={styles.card}>
							<div className={styles.cardHeader}>
								<h3 title={document.filename}>{document.filename}</h3>
								<span>{new Intl.DateTimeFormat('pt-BR', {
								day: '2-digit',
								month: 'long',
								year: 'numeric',
							}).format(new Date(document.createdAt))}</span>
							</div>
						<div className={styles.cardBody}>
							<Image src='/blame.jpg' alt={document.filename} width={500} height={500} className={styles.cardImage} />
						</div>
					</div>
				))}
			</div>
		</article>
	)
}
