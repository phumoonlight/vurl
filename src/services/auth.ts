import { cookie } from '../common/cookie'
import { httpClient } from '../common/http'



export const fetchAccessToken = async (userId: string) => {
	try {
		const res = await httpClient.get('bookmark/items')
		const token = res.data.data || ''
		cookie.setAccessToken(token)
		return token
	} catch (error) {
		cookie.setAccessToken('')
		return ''
	}
}
