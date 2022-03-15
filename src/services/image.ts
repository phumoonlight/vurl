import { httpClient } from '../common/http'

export const uploadImage = async (file: File) => {
	try {
		const payload = new FormData()
		payload.set('file', file)
		const res = await httpClient.post('api/vurl/images', payload)
		return res.data
	} catch (error) {
		return null
	}
}
