import { httpClient } from '../common/http'

export const uploadImage = async (file: any) => {
	try {
		const payload = new FormData()
		payload.set('file', file)
		const url = `api/upload/`
		const res = await httpClient.post(url, payload)
		return res.data
	} catch (error) {
		return null
	}
}
