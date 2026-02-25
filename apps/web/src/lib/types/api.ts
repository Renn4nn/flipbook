import type { RESOURCES } from '@repo/constants'
import type { ApiResponse, DataType } from '@repo/schemas'

export type API_METHODS = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type ApiRequestParams<T extends DataType> = {
	method: API_METHODS
	url: string
	data?: T
}

export type ApiRequestReturn<T extends DataType> = Promise<ApiResponse<T>>

export type CachedApiRequestParams<T extends DataType = never> = {
	url: ApiRequestParams<T>['url']
	tagsToCache: RESOURCES[]
}
