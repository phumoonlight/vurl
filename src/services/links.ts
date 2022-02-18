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

export const useBookmarks = () => {
	const bookmarks = ref<BookmarkDoc[]>([])
	const fetchData = async (groupId: string) => {
		bookmarks.value = await getLinks(groupId)
	}
	return reactive({
		data: bookmarks,
		fetchData,
	})
}
