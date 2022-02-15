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

export const getBookmarks = async (groupId: string): Promise<any[]> => {
	try {
		const url = `api/bookmark/bookmarks/?group=${groupId}`
		const res = await httpClient.get<{ data: BookmarkDoc[] }>(url)
		return res.data.data || []
	} catch (error) {
		return []
	}
}

export const useBookmarks = () => {
	const bookmarks = ref<BookmarkDoc[]>([])
	const fetchData = async (groupId: string) => {
		bookmarks.value = await getBookmarks(groupId)
	}
	return reactive({
		data: bookmarks,
		fetchData,
	})
}
