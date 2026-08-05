import { API_ROUTES } from '@repo/constants'
import type { DocumentSchema } from '@repo/schemas'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { apiRequest } from '@/lib/api/request'
import LibrarySkeleton from '@/ui/components/skeletons/library/CardSkeleton/LibrarySkeleton'
import Library from './library'

export default function LibraryPage() {
	return (
		<Suspense fallback={<LibrarySkeleton />}>
			<LibraryContent />
		</Suspense>
	)
}

async function LibraryContent() {
	await connection()

	const documentPromise = apiRequest<DocumentSchema[]>({
		method: 'get',
		url: API_ROUTES.DOCUMENTS.BASE
	})

	return <Library documents={documentPromise} />
}
