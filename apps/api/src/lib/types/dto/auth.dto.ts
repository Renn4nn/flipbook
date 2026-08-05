import { signInSchema, signUpSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class SignInDto extends createZodDto(signInSchema) {}
export class SignUpDto extends createZodDto(signUpSchema) {}
