import { z } from '@repo/config'
import type { Prisma, Document } from '@repo/database'
import type { ApiSuccessResponse } from '../api/api.response.types.js'

// Cria um validador de data que aceita string ISO ou Date, sem usar z.date() para evitar o erro do Zod 4 no JSON Schema
const safeDateTransform = z
	.union([z.string().datetime(), z.custom<Date>((val) => val instanceof Date)])
	.transform((val) => new Date(val as string | Date))

export const createDocumentSchema = z.strictObject({
	id: z.string().uuid().optional(),
	filename: z.string().trim().nonempty(),
	path: z.string().trim(),
	title: z.string().trim().nullish(),
	size: z.string().nonempty(),
	pages: z.coerce.number(),
	isPublic: z
		.preprocess((val) => val === 'true' || val === true, z.boolean())
		.optional(),
	accessToken: z.string().nullish(),
	expiresAt: z.string().datetime().nullish() // API input sempre é string
}) satisfies z.ZodType<Prisma.DocumentCreateInput>

export const updateDocumentSchema = createDocumentSchema.partial()

export const documentSchema = z.strictObject({
	...createDocumentSchema.shape,
	id: z.string().uuid(),
	title: z.string().nullable(),
	size: z.string(),
	isPublic: z.boolean(),
	accessToken: z.string().nullable(),
	expiresAt: safeDateTransform.nullable(),
	updatedAt: safeDateTransform,
	createdAt: safeDateTransform
}) satisfies z.ZodType<Document>

export const documentResponseSchema = z.strictObject({
	data: documentSchema
}) satisfies z.ZodType<ApiSuccessResponse<Document>>

export type DocumentSchema = z.infer<typeof documentSchema>
export type DocumentResponseSchema = z.infer<typeof documentResponseSchema>
export type CreateDocumentSchema = z.infer<typeof createDocumentSchema>
export type UpdateDocumentSchema = z.infer<typeof updateDocumentSchema>
