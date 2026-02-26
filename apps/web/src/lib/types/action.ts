import type { RESOURCES } from '@repo/constants'
import type { DataType } from '@repo/schemas'
import type { ApiRequestParams } from './api'

export type ApiActionParams<T extends DataType> = ApiRequestParams<T> & {
	successMessage: string
	tags?: RESOURCES[]
}

export type ApiActionReturn<T extends DataType> = {
	message: string
	data: T | null
	headers?: Record<string, string>
}
