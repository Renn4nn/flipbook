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

export default function Home() {
	const documentPromise = cachedApiRequest<DocumentSchema[]>({
		url: API_ROUTES.DOCUMENTS.BASE,
		tagsToCache: [RESOURCES.DOCUMENTS]
	})
	return (
		<Workspace documentsPromise={documentPromise} />
	)
}
