import 'server-only'

import axios from 'axios'
import axiosRetry from 'axios-retry'

const api = axios.create({
	baseURL: process.env.API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
})

axiosRetry(api, {
	retries: 5,
	retryDelay: (retryCount) => {
		console.log(`Tentativa de conexão nª ${retryCount}...`)
		return retryCount * 1000
	},
	retryCondition: (error) => {
		return (
			axiosRetry.isNetworkOrIdempotentRequestError(error) ||
			error.code === 'ECONNREFUSED'
		)
	},
	shouldResetTimeout: true
})

export default api
