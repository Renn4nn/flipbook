// função cacheada para requisições à API - usar apenas em Server Components
import type { ApiResponse, DataType } from '@repo/schemas'
import { cacheTag } from 'next/cache'
import { apiRequest } from './index'
import type { ApiRequestReturn, CachedApiRequestParams } from '@/lib/types/api'

export async function cachedApiRequest<T extends DataType>({
	url,
	tagsToCache
}: CachedApiRequestParams): ApiRequestReturn<T> {
	'use cache'
	cacheTag(...tagsToCache)
	return apiRequest({ method: 'get', url })
}
