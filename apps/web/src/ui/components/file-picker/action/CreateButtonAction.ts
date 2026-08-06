'use server'

import { API_ROUTES } from '@repo/constants'
import { apiRequest } from '@/lib/api/request'
import type { ApiActionReturn } from '@/lib/types/action'

type CreateProps = {
	file: File
	type: string
}

export async function createBookAction({
	file,
	type
}: CreateProps): Promise<ApiActionReturn<Record<string, unknown>>> {
	const res = await apiRequest({
		method: 'post',
		url: API_ROUTES.DOCUMENTS.BASE,
		data: {
			file,
			type
		},
		refreshOnUnauthorized: true
	})

	return {
		message: 'Documento criado com sucesso',
		data: res
	}
}
