import { reactive, ref } from 'vue'
import { LinkDocument } from './link.type'
import { getLinks, updateOrder } from './link.http'

const editingLink = ref<LinkDocument | null>(null)
const links = ref<LinkDocument[]>([])

export const useLink = () => {
	const sortByOrder = () => {
		links.value.sort((a, b) => b.order - a.order)
	}
	const fetchData = async (groupId: string) => {
		links.value = await getLinks(groupId)
		sortByOrder()
	}
	return reactive({
		links,
		editingLink,
		fetchData,
		updateOrder,
	})
}
