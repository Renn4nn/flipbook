import type { ApiErrorResponse, ApiResponse, DataType } from '@repo/schemas'
import axios, { type AxiosResponse } from 'axios'

export async function asyncApiTryCatch<T extends DataType>(
	promise: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> {
	try {
		const data: unknown = (await promise).data

		if (isApiResponse<T>(data)) return data

		return createDefaultError('A API retornou uma resposta inválida.')
	} catch (err) {
		return handleApiError(err)
	}
}

function handleApiError(err: unknown): ApiErrorResponse {
	if (axios.isAxiosError(err) && isApiErrorResponse(err.response?.data)) {
		return err.response.data
	}

	console.error('asyncTryCatch:', err)
	return createDefaultError('Não foi possível comunicar com a API.')
}

function createDefaultError(message: string): ApiErrorResponse {
	return {
		error: {
			type: 'API_ERROR',
			message,
			details: 'A resposta recebida não segue o formato esperado.'
		}
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
	return isRecord(value) && ('error' in value || 'errors' in value)
}

function isApiResponse<T extends DataType>(
	value: unknown
): value is ApiResponse<T> {
	return (
		isRecord(value) &&
		('data' in value || 'error' in value || 'errors' in value)
	)
}
