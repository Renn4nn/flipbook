import { API_ROUTES, RESOURCES } from '@repo/constants'
import type { DocumentSchema } from '@repo/schemas'
import { Suspense } from 'react'
import { cachedApiRequest } from '@/lib/api/request/cached'
import WorkspaceSkeleton from '@/ui/components/skeletons/workspace/CardSkeleton/WorkspaceSkeleton'
import Workspace from '@/ui/pages/workspace/page'

export default function WorkspacePage() {
	const documentPromise = cachedApiRequest<DocumentSchema[]>({
		url: API_ROUTES.DOCUMENTS.BASE,
		tagsToCache: [RESOURCES.DOCUMENTS]
	})

	return (
		<Suspense fallback={<WorkspaceSkeleton />}>
			<Workspace documentsPromise={documentPromise} />
		</Suspense>
	)
}
