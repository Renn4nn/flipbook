'use server'
import { API_ROUTES, RESOURCES } from '@repo/constants'
import FlipBookPage from '@/ui/pages/FlipBookPage/FlipBookPage'
import { Suspense } from 'react'
import { cachedApiRequest } from '@/lib/api/request'
import { notFound } from 'next/navigation'
import { ApiSuccessResponse, DocumentSchema } from '@repo/schemas'

async function FlipBookContent({ id }: { id: string }) {

	const response = await cachedApiRequest<DocumentSchema>({
		url: `${API_ROUTES.DOCUMENTS.BASE}/${id}`,
		tagsToCache: [RESOURCES.DOCUMENTS]
	})

	const data = (response as ApiSuccessResponse<DocumentSchema>).data

	if (!data) {
		return notFound()
	}

	return <FlipBookPage path={data.path} />
}

export default async function DocPage(props: {
	params: Promise<{ id: string }>
}) {
	const { id } = await props.params

	if(!id) {
		return notFound()
	}

	return (
		<Suspense fallback="Carregando...">
			<FlipBookContent id={id} />
		</Suspense>
	)
}
