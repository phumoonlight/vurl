import { computed, reactive, ref, watch } from 'vue'
import { getFileFromEvent, loadImage, wait } from '../common/utils'
import { uploadImage } from '../services/image'
import { deleteLink, updateLink } from '../services/links'

export const useLinkForm = () => {
	const linkId = ref('')
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

	const update = async () => {
		if (!linkId.value) return false
		let thumbnail = imageUrl.value
		if (imageFile.value) {
			const resUpload = await uploadImage(imageFile.value)
			if (!resUpload) return false
			thumbnail = resUpload.uploadedUrl || ''
		}
		const resUpdate = await updateLink(linkId.value, {
			title: name.value,
			url: url.value,
			timg: thumbnail,
		})
		return !!resUpdate
	}

	const remove = async () => {
		if (!linkId.value) return false
		const res = await deleteLink(linkId.value)
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
		linkId,
		name,
		url,
		imageUrl,
		imageFile,
		previewImageUrl,
		isImageUrlResolved,
		clearInput,
		update,
		remove,
		handleFileChange,
	})
}
