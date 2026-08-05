export enum RESOURCES {
	DOCUMENTS = 'documents',
	USERS = 'users'
}

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
		BASE: `/${RESOURCES.DOCUMENTS}`,
		BY_ID: (id: string | number) => `/${RESOURCES.DOCUMENTS}/${id}`,
		FILE: (id: string | number) => `/${RESOURCES.DOCUMENTS}/${id}/file`
	},
	USERS: {
		BASE: `/${RESOURCES.USERS}`,
		BY_ID: (id: string | number) => `/${RESOURCES.USERS}/${id}`
	}
} as const
