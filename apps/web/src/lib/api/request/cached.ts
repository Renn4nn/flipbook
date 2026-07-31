// função cacheada para requisições à API - usar apenas em Server Components
import type { DataType } from '@repo/schemas'
import { cacheTag } from 'next/cache'
import type { ApiRequestReturn, CachedApiRequestParams } from '@/lib/types/api'
import { apiRequest } from './index'

export async function cachedApiRequest<T extends DataType>({
	url,
	tagsToCache
}: CachedApiRequestParams): ApiRequestReturn<T> {
	'use cache'
	cacheTag(...tagsToCache)
	return apiRequest({ method: 'get', url })
}
