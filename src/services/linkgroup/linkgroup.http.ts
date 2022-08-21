import { httpClient } from '@/common/http'
import { GroupDocument } from './linkgroup.type'

export const getGroups = async (): Promise<GroupDocument[]> => {
	try {
		const url = `api/vurl/linkgroups/`
		const res = await httpClient.get<{ value: GroupDocument[] }>(url)
		console.log(res.data.value)
		return res.data.value || []
	} catch (error) {
		return []
	}
}

export const createGroup = async (payload: any) => {
	try {
		const url = `api/vurl/linkgroups/`
		const res = await httpClient.post(url, payload)
		return res.data
	} catch (error) {
		return null
	}
}

export const updateGroup = async (id: string, payload: any) => {
	try {
		const url = `api/vurl/linkgroups/${id}`
		const res = await httpClient.patch(url, payload)
		return res.data
	} catch (error) {
		return null
	}
}

export const deleteGroup = async (id: string) => {
	try {
		const url = `api/vurl/linkgroups/${id}`
		await httpClient.delete(url)
		return true
	} catch (error) {
		return false
	}
}

export const updateOrder = async (id: string, posn: number) => {
	try {
		const url = `api/vurl/linkgroups/${id}`
		const res = await httpClient.patch(url, {
			posn,
		})
		return res.data
	} catch (error) {
		return null
	}
}
