import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post
} from '@nestjs/common'
import { RESOURCES } from '@repo/constants'
import type { ApiSuccessResponse, UserSchema } from '@repo/schemas'
import { CreateUserDto, UpdateUserDto } from '../lib/types/dto/user.dto'
import { UserService } from './user.service'

@Controller(RESOURCES.USERS)
export class UserController {
	constructor(private readonly service: UserService) {}

	@Get()
	async getUsers(): Promise<ApiSuccessResponse<UserSchema[]>> {
		return { data: await this.service.getUsers() }
	}

	@Get(':id')
	async getUserById(
		@Param('id', ParseUUIDPipe) id: string
	): Promise<ApiSuccessResponse<UserSchema>> {
		return { data: await this.service.getUserById(id) }
	}

	@Post()
	async createUser(
		@Body() data: CreateUserDto
	): Promise<ApiSuccessResponse<UserSchema>> {
		return { data: await this.service.createUser(data) }
	}

	@Patch(':id')
	async updateUser(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() data: UpdateUserDto
	): Promise<ApiSuccessResponse<UserSchema>> {
		return { data: await this.service.updateUserById(id, data) }
	}

	@Delete(':id')
	async deleteUser(
		@Param('id', ParseUUIDPipe) id: string
	): Promise<ApiSuccessResponse<UserSchema>> {
		return { data: await this.service.deleteUserById(id) }
	}
}
