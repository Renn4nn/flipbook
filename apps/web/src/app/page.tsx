import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'CTD Flipbook',
	description:
		'CTD flipbook is a web page where you can read documents in an interactive way.'
}

import Workspace from '@/ui/pages/workspace/page'
import { cachedApiRequest } from '@/lib/api/request'
import { DocumentSchema } from '@repo/schemas'
import { API_ROUTES, RESOURCES } from '@repo/constants'
import { Suspense } from 'react'
import WorkspaceSkeleton from '@/ui/components/skeletons/workspace/WorkspaceSkeleton'

export default function Home() {
	const documentPromise = cachedApiRequest<DocumentSchema[]>({
		url: API_ROUTES.DOCUMENTS.BASE,
		tagsToCache: [RESOURCES.DOCUMENTS]
	})
	const delayedPromise = new Promise((resolve) =>
		setTimeout(() => resolve(documentPromise), 3000)
	)
	return (
		<Suspense fallback={<WorkspaceSkeleton />}>
			{/* @ts-expect-error - ignorar tipos apenas para o teste do delay */}
			<Workspace documentsPromise={delayedPromise} />
		</Suspense>
	)
}
