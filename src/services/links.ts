import { reactive, ref } from 'vue'
import { httpClient } from '../common/http'

export interface BookmarkDoc {
	id: string
	gid: string
	uid: string
	timg: string
	title: string
	url: string
	order: number
}

export const getLinks = async (groupId: string): Promise<any[]> => {
	try {
		const url = `api/vurl/links/?group=${groupId}`
		const res = await httpClient.get<{ data: BookmarkDoc[] }>(url)
		return res.data.data || []
	} catch (error) {
		return []
	}
}

export const createLink = async (payload: any) => {
	try {
		const url = `api/vurl/links/`
		const res = await httpClient.post(url, payload)
		return res.data
	} catch (error) {
		return null
	}
}

export const updateLink = async (id: string, payload: any) => {
	try {
		const url = `api/vurl/links/${id}`
		const res = await httpClient.patch(url, payload)
		return res.data
	} catch (error) {
		return null
	}
}

export const deleteLink = async (id: string) => {
	try {
		const url = `api/vurl/links/${id}`
		const res = await httpClient.delete(url)
		return res.data
	} catch (error) {
		return null
	}
}

export const updateOrder = async (id: string, order: number) => {
	try {
		const url = `api/vurl/links/${id}`
		const res = await httpClient.patch(url, {
			order,
		})
		return res.data
	} catch (error) {
		return null
	}
}

const links = ref<BookmarkDoc[]>([])
export const useLinks = () => {
	const fetchData = async (groupId: string) => {
		links.value = await getLinks(groupId)
		links.value.sort((a, b) => b.order - a.order)
	}
	return reactive({
		data: links,
		fetchData,
		updateOrder,
	})
}
