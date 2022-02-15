import { reactive, ref } from 'vue'
import { httpClient } from '../common/http'

export interface BookmarkGroupDoc {
	id: string
	uid: string
	title: string
	desc: string
	timg: string
	order: number
}

export const getBookmarkGroups = async (): Promise<BookmarkGroupDoc[]> => {
	try {
		const url = `api/bookmark/groups/`
		const res = await httpClient.get<{ data: BookmarkGroupDoc[] }>(url)
		return res.data.data || []
	} catch (error) {
		return []
	}
}

export const useBookmarkGroups = () => {
	const groups = ref<BookmarkGroupDoc[]>([])
	const fetchData = async () => {
		groups.value = await getBookmarkGroups()
	}
	return reactive({
		data: groups,
		fetchData,
	})
}
