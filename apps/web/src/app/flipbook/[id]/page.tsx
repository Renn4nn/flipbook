import { API_ROUTES } from '@repo/constants'
import FlipBookPage from '@/ui/pages/FlipBookPage/FlipBookPage'
import { Suspense } from 'react'
import type { DocumentSchema } from '@repo/schemas'
import { apiAction } from '@/lib/api/actions'
import { notFound } from 'next/navigation'

export default async function DocPage(props: {
	params: Promise<{ id: string }>
}) {
	const params = await props.params
	const id = params.id

	const response = (
		await apiAction<DocumentSchema>({
			method: 'get',
			url: `${API_ROUTES.DOCUMENTS.BASE}/${id}`,
			successMessage: 'Documento encontrado'
		})
	).data

	if (!response) {
		return notFound()
	}

	return (
		<Suspense fallback="Carregando...">
			<FlipBookPage path={response.path} />
		</Suspense>
	)
}
