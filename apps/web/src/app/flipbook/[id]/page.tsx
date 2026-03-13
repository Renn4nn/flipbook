import { API_ROUTES } from '@repo/constants'
import type { DocumentResponseSchema } from '@repo/schemas'
import { Suspense } from 'react'
import { apiRequest } from '@/lib/api/request'
import FlipBookPage from '@/ui/pages/FlipBookPage/FlipBookPage'

export default async function Page({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	if (!id) {
		return <div>ID não fornecido</div>
	}

	const responsePromise = apiRequest<DocumentResponseSchema>({
		method: 'get',
		url: API_ROUTES.DOCUMENTS.BY_ID(id)
	})

	return (
		<Suspense fallback="Carregando documento...">
			<FlipBookPage documentPromise={responsePromise} />
		</Suspense>
	)
}
