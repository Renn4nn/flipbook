import { API_ROUTES, RESOURCES } from '@repo/constants'
import type { DocumentSchema } from '@repo/schemas'
import { Suspense } from 'react'
import Workspace from '@/app/workspace/workspace'
import { cachedApiRequest } from '@/lib/api/request/cached'
import WorkspaceSkeleton from '@/ui/components/skeletons/workspace/CardSkeleton/WorkspaceSkeleton'

export default function WorkspacePage() {
	const documentPromise = cachedApiRequest<DocumentSchema[]>({
		url: API_ROUTES.DOCUMENTS.BASE,
		tagsToCache: [RESOURCES.DOCUMENTS]
	})

	return (
		<Suspense fallback={<WorkspaceSkeleton />}>
			<Workspace documents={documentPromise} />
		</Suspense>
	)
}
