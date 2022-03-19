import { useGlobalStore } from '@/hooks/store'
import { reactive, ref } from 'vue'
import { httpClient } from '../common/http'

export interface GroupDocument {
	id: string
	uid: string
	title: string
	desc: string
	timg: string
	order: number
}

export const getBookmarkGroups = async (): Promise<GroupDocument[]> => {
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

export const useLinkGroups = () => {
	const store = useGlobalStore()
	const sort = () => store.groups.sort((a, b) => b.order - a.order)
	const fetchData = async () => {
		store.groups = await getBookmarkGroups()
		console.log(store.groups)
		sort()
	}
	const add = (group: GroupDocument) => {
		store.groups.push(group)
		sort()
	}
	const localUpdate = (editedGroup: GroupDocument) => {
		store.groups = store.groups.map((group) => {
			if (group.id !== editedGroup.id) return group
			return editedGroup
		})
	}
	return reactive({
		data: ref(store.groups),
		fetchData,
		add,
		localUpdate,
	})
}
