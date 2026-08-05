import { z } from '@repo/config'
import { createUserSchema } from '../user/user.schema.js'

export const signInSchema = z.strictObject({
	login: z.string().trim().toLowerCase().min(3).max(100),
	password: z.string().min(1)
})

export const signUpSchema = createUserSchema
	.pick({ login: true, password: true })
	.extend({
		confirmPassword: z.string().min(8)
	})
	.refine(({ confirmPassword, password }) => confirmPassword === password, {
		message: 'As senhas não coincidem.',
		path: ['confirmPassword']
	})

export type SignInSchema = z.infer<typeof signInSchema>
export type SignUpSchema = z.infer<typeof signUpSchema>
