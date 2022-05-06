import { computed, reactive, ref, watch } from 'vue'
import { getFileFromEvent } from '@/common/file'
import { loadImage } from '@/common/image'
import { wait } from '@/common/timer'
import { uploadImage } from '@/services/image'
import { LinkDocument } from './link.type'
import * as linkHttp from './link.http'

const editingLink = ref<LinkDocument | null>(null)
const links = ref<LinkDocument[]>([])

export const useLink = () => {
	const sortByOrder = () => {
		links.value.sort((a, b) => b.order - a.order)
	}
	const fetchData = async (groupId: string) => {
		links.value = await linkHttp.getLinks(groupId)
		sortByOrder()
	}
	return reactive({
		links,
		editingLink,
		fetchData,
	})
}

export const useLinkForm = () => {
	const link = useLink()
	const name = ref('')
	const url = ref('')
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
		url.value = ''
		imageUrl.value = ''
		imageFile.value = null
	}

	const create = async (groupId: string) => {
		let thumbnail = imageUrl.value
		if (imageFile.value) {
			const resUpload = await uploadImage(imageFile.value)
			if (!resUpload) return false
			thumbnail = resUpload.uploadedUrl || ''
		}
		const resCreate = await linkHttp.createLink({
			gid: groupId,
			title: name.value,
			url: url.value,
			timg: thumbnail,
			order: link.links.length,
		})
		return !!resCreate
	}

	const update = async (groupId: string) => {
		if (!link.editingLink) return false
		let thumbnail = imageUrl.value
		if (imageFile.value) {
			const resUpload = await uploadImage(imageFile.value)
			if (!resUpload) return false
			thumbnail = resUpload.uploadedUrl || ''
		}
		const resUpdate = await linkHttp.updateLink(link.editingLink.id, {
			gid: groupId,
			title: name.value,
			url: url.value,
			timg: thumbnail,
		})
		return !!resUpdate
	}

	const remove = async () => {
		if (!link.editingLink) return false
		const res = await linkHttp.deleteLink(link.editingLink.id)
		await wait(500)
		return !!res
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
		url,
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
