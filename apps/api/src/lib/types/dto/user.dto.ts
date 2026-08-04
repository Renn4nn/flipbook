import {
	createUserSchema,
	updateUserSchema,
	userResponseSchema
} from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
export class UserDto extends createZodDto(userResponseSchema) {}
