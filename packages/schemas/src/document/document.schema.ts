import { z } from '@repo/config'
import type { Document, Prisma } from '@repo/database'
import type { ApiSuccessResponse } from '../api/api.response.types.js'

// Cria um validador de data que aceita string ISO ou Date, sem usar z.date() para evitar o erro do Zod 4 no JSON Schema
const safeDateTransform = z
	.union([z.string().datetime(), z.custom<Date>((val) => val instanceof Date)])
	.transform((val) => new Date(val as string | Date))

type CreateDocumentInput = Pick<
	Prisma.DocumentUncheckedCreateInput,
	'id' | 'filename' | 'path' | 'title' | 'size' | 'pages' | 'isPublic'
>

type PublicDocument = Omit<Document, 'ownerId'> & { canManage: boolean }

export const createDocumentSchema = z.strictObject({
	id: z.string().uuid().optional(),
	filename: z.string().trim().nonempty(),
	path: z.string().trim(),
	title: z.string().trim().nullish(),
	size: z.string().nonempty(),
	pages: z.coerce.number(),
	isPublic: z
		.preprocess((val) => val === 'true' || val === true, z.boolean())
		.optional()
}) satisfies z.ZodType<CreateDocumentInput>

export const updateDocumentSchema = createDocumentSchema.partial()

export const documentSchema = z.strictObject({
	...createDocumentSchema.shape,
	id: z.string().uuid(),
	title: z.string().nullable(),
	size: z.string(),
	isPublic: z.boolean(),
	canManage: z.boolean(),
	updatedAt: safeDateTransform,
	createdAt: safeDateTransform
}) satisfies z.ZodType<PublicDocument>

export const documentResponseSchema = z.strictObject({
	data: documentSchema
}) satisfies z.ZodType<ApiSuccessResponse<PublicDocument>>

export const documentSharingUserSchema = z.strictObject({
	id: z.string().uuid(),
	login: z.string()
})

export const updateDocumentSharingSchema = z.strictObject({
	isPublic: z.boolean(),
	userIds: z
		.array(z.string().uuid())
		.refine((ids) => new Set(ids).size === ids.length, {
			message: 'Os usuários não podem ser repetidos.'
		})
})

export const documentSharingSchema = z.strictObject({
	isPublic: z.boolean(),
	userIds: z.array(z.string().uuid()),
	availableUsers: z.array(documentSharingUserSchema)
})

export type DocumentSchema = z.infer<typeof documentSchema>
export type DocumentResponseSchema = z.infer<typeof documentResponseSchema>
export type CreateDocumentSchema = z.infer<typeof createDocumentSchema>
export type UpdateDocumentSchema = z.infer<typeof updateDocumentSchema>
export type DocumentSharingSchema = z.infer<typeof documentSharingSchema>
export type UpdateDocumentSharingSchema = z.infer<
	typeof updateDocumentSharingSchema
>
