// função para fazer uma promise de requisição à API
import type { ApiResponse, DataType } from '@repo/schemas'
import axios, { type AxiosResponse } from 'axios'
import api from '@/lib/api/config/axios'
import { asyncApiTryCatch } from '@/lib/api/error'
import { getAccessToken, renewSession } from '@/lib/auth/session'
import type { ApiRequestParams, ApiRequestReturn } from '@/lib/types/api'

export async function apiRequest<
	T extends DataType,
	D extends DataType = never
>({
	method,
	url,
	data,
	refreshOnUnauthorized = false
}: ApiRequestParams<D>): ApiRequestReturn<T> {
	const request = async (accessToken?: string) =>
		api.request<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>({
			method,
			url,
			data,
			headers: accessToken
				? { Authorization: `Bearer ${accessToken}` }
				: undefined
		})

	try {
		const response = await request(await getAccessToken())
		return asyncApiTryCatch(Promise.resolve(response))
	} catch (error) {
		if (
			refreshOnUnauthorized &&
			axios.isAxiosError(error) &&
			error.response?.status === 401
		) {
			const renewedAccessToken = await renewSession()
			if (renewedAccessToken) {
				try {
					const response = await request(renewedAccessToken)
					return asyncApiTryCatch(Promise.resolve(response))
				} catch (retryError) {
					return asyncApiTryCatch(Promise.reject(retryError))
				}
			}
		}

		return asyncApiTryCatch(Promise.reject(error))
	}
}
