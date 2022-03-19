import { getBookmarkGroups, GroupDocument } from '@/services/linkgroups'
import { useGlobalStore } from './store'

export const useMutationLinkGroups = () => {
	const store = useGlobalStore()
	const sort = () => {
		store.groups.sort((a, b) => b.order - a.order)
	}
	const fetchData = async () => {
		store.groups = await getBookmarkGroups()
		sort()
	}
	const localAdd = (group: GroupDocument) => {
		store.groups.push(group)
		sort()
	}
	const localUpdate = (editedGroup: GroupDocument) => {
		store.groups = store.groups.map((group) => {
			if (group.id !== editedGroup.id) return group
			return editedGroup
		})
	}
	return {
		fetchData,
		localAdd,
		localUpdate,
	}
}
