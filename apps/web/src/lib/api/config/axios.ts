import 'server-only'

import axios from 'axios'
import axiosRetry from 'axios-retry'

// refatorar isso aqui
const api = axios.create({
	baseURL: process.env.API_BASE_URL,
	headers: {  }
})

// interceptador para enviar arquivos
api.interceptors.request.use((config) => {
	const data = config.data
 
	if (typeof FormData !== 'undefined' && data instanceof FormData) {
		if (config.headers) {
			delete config.headers['Content-Type']
		}
		return config
	}
 
	if (data !== undefined) {
		config.headers = config.headers ?? {}
		if (!config.headers['Content-Type']) {
			config.headers['Content-Type'] = 'application/json'
		}
	}
 
	return config
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
