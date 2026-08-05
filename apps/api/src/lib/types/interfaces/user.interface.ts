import type { Prisma } from '@repo/database'
import type { ApiSuccessResponse, UserSchema } from '@repo/schemas'
import type { CreateUserDto, UpdateUserDto } from '../dto/user.dto'

export const userSelect = {
	id: true,
	login: true,
	createdAt: true,
	updatedAt: true,
	documents: {
		orderBy: {
			createdAt: 'asc'
		}
	}
} satisfies Prisma.UserSelect

export type GetUsersParams = {
	skip?: number
	take?: number
	cursor?: Prisma.UserWhereUniqueInput
	where?: Prisma.UserWhereInput
	orderBy?: Prisma.UserOrderByWithRelationInput
}

export type UpdateUserParams = {
	where: Prisma.UserWhereUniqueInput
	data: Prisma.UserUpdateInput
}

export interface IUserRepository {
	user(where: Prisma.UserWhereUniqueInput): Promise<UserSchema>
	users(params: GetUsersParams): Promise<UserSchema[]>
	createUser(data: Prisma.UserCreateInput): Promise<UserSchema>
	updateUser(params: UpdateUserParams): Promise<UserSchema>
	deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserSchema>
}

export interface IUserService {
	getUsers(): Promise<UserSchema[]>
	getUserById(id: string): Promise<UserSchema>
	createUser(data: CreateUserDto): Promise<UserSchema>
	updateUserById(id: string, data: UpdateUserDto): Promise<UserSchema>
	deleteUserById(id: string): Promise<UserSchema>
}

export interface IUserController {
	getUsers(): Promise<ApiSuccessResponse<UserSchema[]>>
	getUserById(id: string): Promise<ApiSuccessResponse<UserSchema>>
	createUser(data: CreateUserDto): Promise<ApiSuccessResponse<UserSchema>>
	updateUser(
		id: string,
		data: UpdateUserDto
	): Promise<ApiSuccessResponse<UserSchema>>
	deleteUser(id: string): Promise<ApiSuccessResponse<UserSchema>>
}
