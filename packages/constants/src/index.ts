export enum RESOURCES {
	DOCUMENTS = 'documents',
	USERS = 'users'
}

export const API_PREFIX = '/api'

export const AUTH_ROUTES = {
	SIGN_IN: `${API_PREFIX}/auth/signin`,
	SIGN_UP: `${API_PREFIX}/auth/signup`,
	REFRESH: `${API_PREFIX}/auth/refresh`,
	ME: `${API_PREFIX}/auth/me`,
	LOGOUT: `${API_PREFIX}/auth/logout`
} as const

type RouteProps = {
	BASE: string
	BY_ID: (id: string | number) => string
}

type ROUTES = {
	DOCUMENTS: RouteProps & {
		FILE: (id: string | number) => string
	}
	USERS: RouteProps
}

export const API_ROUTES: ROUTES = {
	DOCUMENTS: {
		BASE: `${API_PREFIX}/${RESOURCES.DOCUMENTS}`,
		BY_ID: (id: string | number) =>
			`${API_PREFIX}/${RESOURCES.DOCUMENTS}/${id}`,
		FILE: (id: string | number) =>
			`${API_PREFIX}/${RESOURCES.DOCUMENTS}/${id}/file`
	},
	USERS: {
		BASE: `${API_PREFIX}/${RESOURCES.USERS}`,
		BY_ID: (id: string | number) =>
			`${API_PREFIX}/${RESOURCES.USERS}/${id}`
	}
} as const
