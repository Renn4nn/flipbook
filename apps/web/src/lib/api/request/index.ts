// função para fazer uma promise de requisição à API
import type { ApiResponse, DataType } from '@repo/schemas'
import type { AxiosResponse } from 'axios'
import { cacheTag } from 'next/cache'
import api from '@/lib/api/config/axios'
import { asyncApiTryCatch } from '@/lib/api/error'
import type {
	ApiRequestParams,
	ApiRequestReturn,
	CachedApiRequestParams
} from '@/lib/types/api'

export async function apiRequest<
	T extends DataType,
	D extends DataType = never
>({ method, url, data }: ApiRequestParams<D>): ApiRequestReturn<T> {
	return asyncApiTryCatch(
		api[method]<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(url, data)
	)
}

// caso necessário cachear a requisição
export async function cachedApiRequest<T extends DataType>({
	url,
	tagsToCache
}: CachedApiRequestParams): ApiRequestReturn<T> {
	'use cache'
	cacheTag(...tagsToCache)
	return apiRequest({ method: 'get', url })
}
