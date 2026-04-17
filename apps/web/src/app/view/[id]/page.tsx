import { API_ROUTES } from '@repo/constants'
import type { DocumentResponseSchema } from '@repo/schemas'
import { Suspense } from 'react'
import { apiRequest } from '@/lib/api/request'
import FlipBookPage from '@/ui/pages/FlipBookPage/FlipBookPage'
import PageLoadingSkeleton from '@/ui/components/skeletons/workspace/PageLoadingSkeleton/PageLoadingSkeleton'

export default async function PublicViewPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <ViewContainer params={params} />
    </Suspense>
  )
}

async function ViewContainer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return <div>ID não fornecido</div>;

  const responsePromise = apiRequest<DocumentResponseSchema>({
    method: 'get',
    url: API_ROUTES.DOCUMENTS.BY_ID(id)
  });

  return <FlipBookPage documentPromise={responsePromise} />;
}