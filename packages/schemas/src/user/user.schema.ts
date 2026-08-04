import { z } from '@repo/config'
import type { Document, User } from '@repo/database'
import type { ApiSuccessResponse } from '../api/api.response.types.js'
import { documentSchema } from '../document/document.schema.js'

const safeDateTransform = z
	.union([
		z.string().datetime(),
		z.custom<Date>((value) => value instanceof Date)
	])
	.transform((value) => new Date(value as string | Date))

const documentIdsSchema = z
	.array(z.string().uuid())
	.refine((ids) => new Set(ids).size === ids.length, {
		message: 'Os documentos não podem ser repetidos.'
	})

export const createUserSchema = z.strictObject({
	email: z.string().trim().toLowerCase().email(),
	password: z.string().min(8),
	documentIds: documentIdsSchema.optional()
})

export const updateUserSchema = createUserSchema.partial()

export const userSchema = z.strictObject({
	id: z.string().uuid(),
	email: z.string().email(),
	createdAt: safeDateTransform,
	updatedAt: safeDateTransform,
	documents: z.array(documentSchema)
}) satisfies z.ZodType<Omit<User, 'password'> & { documents: Document[] }>

export const userResponseSchema = z.strictObject({
	data: userSchema
}) satisfies z.ZodType<ApiSuccessResponse<UserSchema>>

export type UserSchema = z.infer<typeof userSchema>
export type UserResponseSchema = z.infer<typeof userResponseSchema>
export type CreateUserSchema = z.infer<typeof createUserSchema>
export type UpdateUserSchema = z.infer<typeof updateUserSchema>
