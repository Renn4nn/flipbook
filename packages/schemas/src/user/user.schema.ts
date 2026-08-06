import { z } from '@repo/config'
import type { User } from '@repo/database'
import type { ApiSuccessResponse } from '../api/api.response.types.js'

const safeDateTransform = z
	.union([
		z.string().datetime(),
		z.custom<Date>((value) => value instanceof Date)
	])
	.transform((value) => new Date(value as string | Date))

export const createUserSchema = z.strictObject({
	login: z.string().trim().toLowerCase().min(3).max(100),
	password: z.string().min(8)
})

export const updateUserSchema = createUserSchema.partial()

export const userSchema = z.strictObject({
	id: z.string().uuid(),
	login: z.string(),
	createdAt: safeDateTransform,
	updatedAt: safeDateTransform
}) satisfies z.ZodType<Omit<User, 'password'>>

export const userResponseSchema = z.strictObject({
	data: userSchema
}) satisfies z.ZodType<ApiSuccessResponse<UserSchema>>

export type UserSchema = z.infer<typeof userSchema>
export type UserResponseSchema = z.infer<typeof userResponseSchema>
export type CreateUserSchema = z.infer<typeof createUserSchema>
export type UpdateUserSchema = z.infer<typeof updateUserSchema>
