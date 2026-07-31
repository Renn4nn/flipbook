// função para tratar a resposta de uma promise de requisição à API

'use client'

import type { ApiResponse, DataType } from '@repo/schemas'
import { use, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function useApiResponse<T extends DataType>(
	apiResponsePromise: Promise<ApiResponse<T>>
): T | null {
	const res = use(apiResponsePromise)
	useEffect(() => {
		if (!res || typeof res !== 'object') {
			toast.error('A API retornou uma resposta inválida.')
			return
		}

		if ('error' in res) {
			toast.error(res.error.message)
		}
		if ('errors' in res) {
			res.errors.map((e) => toast.error(e.message))
		}
	}, [res])

	if (!res || typeof res !== 'object') return null
	if ('data' in res) return res.data

	return null
}
