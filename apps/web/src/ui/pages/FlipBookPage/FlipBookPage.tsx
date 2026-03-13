'use client'

import type { ApiResponse, DocumentResponseSchema } from '@repo/schemas'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import useApiResponse from '@/lib/api/hooks'
import { useFlipbookStore } from '@/lib/store/useFlipbook'
import type { FlipBookType } from '@/ui/components/flipbook/type'
import Slider from '@/ui/components/slider/Slider'
import styles from './flipbook-page.module.css'

type DocumentProps = {
	documentPromise: Promise<ApiResponse<DocumentResponseSchema>>
}

const FlipBook = dynamic(() => import('@/ui/components/flipbook'), {
	ssr: false,
	loading: () => <p>Carregando leitor...</p>
})
export default function FlipBookPage({ documentPromise }: DocumentProps) {
	const { reset } = useFlipbookStore()
	const [type] = useState<FlipBookType>('magazine')

	useEffect(() => {
		reset()
	}, [reset])

	const data = useApiResponse<DocumentResponseSchema>(documentPromise)

	// Fazer SKELETON
	if (!data) {
		return <div>Documento não encontrado.</div>
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.flipbookContainer}>
				<FlipBook
					type={type}
					// @ts-expect-error: a estrutura do ApiResponse extrai o data mas o TS não mapeou o nesting
					file={`http://localhost:3001${data?.path}`}
					width={500}
					height={665}
				/>
			</div>

			<div className={styles.sliderContainer}>
				<Slider />
			</div>
		</div>
	)
}
