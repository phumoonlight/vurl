import { httpClient } from '@/common/http'
import { GroupDocument } from './linkgroup.type'

export const getGroups = async (): Promise<GroupDocument[]> => {
	try {
		const url = `api/vurl/groups/`
		const res = await httpClient.get<{ data: GroupDocument[] }>(url)
		return res.data.data || []
	} catch (error) {
		return []
	}
}

export const createGroup = async (payload: any) => {
	try {
		const url = `api/vurl/groups/`
		const res = await httpClient.post(url, payload)
		return res.data
	} catch (error) {
		return null
	}
}

export const updateGroup = async (id: string, payload: any) => {
	try {
		const url = `api/vurl/groups/${id}`
		const res = await httpClient.patch(url, payload)
		return res.data
	} catch (error) {
		return null
	}
}

export const deleteGroup = async (id: string) => {
	try {
		const url = `api/vurl/groups/${id}`
		const res = await httpClient.delete(url)
		return res.data
	} catch (error) {
		return null
	}
}

export const updateOrder = async (id: string, order: number) => {
	try {
		const url = `api/vurl/groups/${id}`
		const res = await httpClient.patch(url, {
			order,
		})
		return res.data
	} catch (error) {
		return null
	}
}

