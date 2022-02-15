import axios from 'axios'
import { cookie } from './cookie'
import { ENV } from './env'

export const httpClient = axios.create({
	baseURL: ENV.APP_API_URL,
})

httpClient.interceptors.request.use(
	(config) => {
		if (!config.headers) return config
		if (config.headers.authorization) return config
		config.headers.authorization = cookie.getAccessToken()
		return config
	},
	(error) => Promise.reject(error)
)
