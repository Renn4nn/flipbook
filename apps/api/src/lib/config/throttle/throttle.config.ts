export const THROTTLE_LIMITS = {
	GENERAL: {
		ttl: 60000,
		limit: 100
	},
	AUTH: {
		ttl: 60000,
		limit: 10
	},
	UPLOAD: {
		ttl: 60000,
		limit: 15
	},
	EXPENSIVE: {
		ttl: 3600000,
		limit: 10
	}
} as const
