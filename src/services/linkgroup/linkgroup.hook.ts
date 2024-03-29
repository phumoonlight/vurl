import { computed, reactive, ref, watch } from 'vue'
import { uploadImage } from '@/services/image'
import { loadImage } from '@/common/image'
import { wait } from '@/common/timer'
import { getFileFromEvent } from '@/common/file'
import { FormGroup, GroupDocument } from './linkgroup.type'
import * as linkGroupHttp from './linkgroup.http'
import { useUrlQuery } from '@/common/urlquery'

const editingGroup = ref<GroupDocument | null>(null)
const groups = ref<GroupDocument[]>([])

export const useLinkGroup = () => {
	const queryGroupId = useUrlQuery('group')

	const viewingGroup = computed(() => {
		return groups.value.find((group) => group.id === queryGroupId.value)
	})

	const sort = () => {
		groups.value.sort((a, b) => b.posn - a.posn)
	}

	const fetchData = async () => {
		groups.value = await linkGroupHttp.getGroups()
		console.log(groups.value)
		sort()
	}

	const localAdd = (group: GroupDocument) => {
		groups.value.push(group)
		sort()
	}

	const localUpdate = (editedGroup: GroupDocument) => {
		groups.value = groups.value.map((group) => {
			if (group.id !== editedGroup.id) return group
			return editedGroup
		})
	}

	return reactive({
		groups,
		editingGroup,
		viewingGroup,
		fetchData,
		localAdd,
		localUpdate,
	})
}

export const useLinkGroupForm = (): FormGroup => {
	const group = useLinkGroup()
	const name = ref('')
	const description = ref('')
	const imageUrl = ref('')
	const imageFile = ref<File | null>(null)
	const isImageUrlResolved = ref(false)

	const previewImageUrl = computed(() => {
		if (imageUrl.value && isImageUrlResolved.value) {
			return imageUrl.value
		}
		if (imageFile.value) {
			return URL.createObjectURL(imageFile.value)
		}
		return ''
	})

	const clearInput = () => {
		name.value = ''
		description.value = ''
		imageUrl.value = ''
		imageFile.value = null
	}

	const create = async () => {
		let thumbnail = imageUrl.value
		if (imageFile.value) {
			const resUpload = await uploadImage(imageFile.value)
			if (!resUpload) return false
			thumbnail = resUpload.value || ''
		}
		const resCreate = await linkGroupHttp.createGroup({
			name: name.value,
			desc: description.value,
			timg: thumbnail,
			posn: group.groups.length,
		})
		return !!resCreate
	}

	const update = async () => {
		if (!group.editingGroup) return null
		let thumbnail = imageUrl.value
		if (imageFile.value) {
			const resUpload = await uploadImage(imageFile.value)
			if (!resUpload) return null
			thumbnail = resUpload.value || ''
		}
		const resUpdate = await linkGroupHttp.updateGroup(group.editingGroup.id, {
			name: name.value,
			desc: description.value,
			timg: thumbnail,
		})
		if (!resUpdate) return null
		const updated: Partial<GroupDocument> = {
			name: name.value,
			desc: description.value,
			timg: thumbnail,
		}
		return updated
	}

	const remove = async () => {
		if (!group.editingGroup) return false
		const isSuccess = await linkGroupHttp.deleteGroup(group.editingGroup.id)
		await wait(500)
		return isSuccess
	}

	const handleFileChange = (event: Event) => {
		imageFile.value = getFileFromEvent(event)
	}

	watch(imageUrl, async (value) => {
		if (!value) {
			isImageUrlResolved.value = false
			return
		}
		try {
			await loadImage(value)
			imageFile.value = null
			isImageUrlResolved.value = true
		} catch (error) {
			isImageUrlResolved.value = false
		}
	})

	watch(imageFile, (value) => {
		if (!value) return
		imageUrl.value = ''
		isImageUrlResolved.value = false
	})

	return reactive({
		name,
		description,
		imageUrl,
		imageFile,
		previewImageUrl,
		isImageUrlResolved,
		clearInput,
		create,
		update,
		remove,
		handleFileChange,
	})
}
