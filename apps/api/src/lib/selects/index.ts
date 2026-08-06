import type { Prisma } from '@repo/database'

export const AUTH_USER_SELECT = {
	id: true,
	login: true
} satisfies Prisma.UserSelect

export const AUTHENTICATION_USER_SELECT = {
	...AUTH_USER_SELECT,
	password: true
} satisfies Prisma.UserSelect

export const DOCUMENT_SELECT = {
	id: true,
	filename: true,
	path: true,
	title: true,
	size: true,
	pages: true,
	isPublic: true,
	ownerId: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.DocumentSelect

export type SelectedDocument = Prisma.DocumentGetPayload<{
	select: typeof DOCUMENT_SELECT
}>
