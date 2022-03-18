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
		const url = `api/vurl/groups/`
		const res = await httpClient.get<{ data: BookmarkGroupDoc[] }>(url)
		return res.data.data || []
	} catch (error) {
		return []
	}
}

const groups = ref<BookmarkGroupDoc[]>([])
export const useBookmarkGroups = () => {
	const sort = () => groups.value.sort((a, b) => b.order - a.order)
	const fetchData = async () => {
		groups.value = await getBookmarkGroups()
		sort()
	}
	const add = (group: BookmarkGroupDoc) => {
		groups.value.push(group)
		sort()
	}
	return reactive({
		data: groups,
		fetchData,
		add
	})
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
