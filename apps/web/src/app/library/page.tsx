import { API_ROUTES, RESOURCES } from '@repo/constants'
import type { DocumentSchema } from '@repo/schemas'
import { Suspense } from 'react'
import Library from '@/app/library/library'
import { cachedApiRequest } from '@/lib/api/request/cached'
import LibrarySkeleton from '@/ui/components/skeletons/library/CardSkeleton/LibrarySkeleton'

export default function LibraryPage() {
	const documentPromise = cachedApiRequest<DocumentSchema[]>({
		url: API_ROUTES.DOCUMENTS.BASE,
		tagsToCache: [RESOURCES.DOCUMENTS]
	})

	return (
		<Suspense fallback={<LibrarySkeleton />}>
			<Library documents={documentPromise} />
		</Suspense>
	)
}
