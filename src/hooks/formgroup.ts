import {
	createGroup,
	deleteGroup,
	GroupDocument,
	updateGroup,
	useLinkGroups,
} from '@/services/linkgroups'
import { computed, reactive, ref, watch } from 'vue'
import { getFileFromEvent, loadImage, wait } from '../common/utils'
import { uploadImage } from '../services/image'
import { useGlobalStore } from './store'

export interface FormGroup {
	name: string
	description: string
	imageUrl: string
	imageFile: File | null
	previewImageUrl: string
	isImageUrlResolved: boolean
	clearInput: () => void
	create: (groupId: string) => Promise<boolean>
	update: () => Promise<Partial<GroupDocument> | null>
	remove: () => Promise<boolean>
	handleFileChange: (event: Event) => void
}

export const useFormGroup = (): FormGroup => {
	const store = useGlobalStore()
	const groups = useLinkGroups()
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

	const create = async (groupId: string) => {
		let thumbnail = imageUrl.value
		if (imageFile.value) {
			const resUpload = await uploadImage(imageFile.value)
			if (!resUpload) return false
			thumbnail = resUpload.uploadedUrl || ''
		}
		const resCreate = await createGroup({
			gid: groupId,
			title: name.value,
			timg: thumbnail,
			order: groups.data.length,
		})
		return !!resCreate
	}

	const update = async () => {
		if (!store.editingGroup) return null
		let thumbnail = imageUrl.value
		if (imageFile.value) {
			const resUpload = await uploadImage(imageFile.value)
			if (!resUpload) return null
			thumbnail = resUpload.uploadedUrl || ''
		}
		const resUpdate = await updateGroup(store.editingGroup.id, {
			title: name.value,
			description: description.value,
			timg: thumbnail,
		})
		if (!resUpdate) return null
		const updated: Partial<GroupDocument> = {
			title: name.value,
			desc: description.value,
			timg: thumbnail,
		}
		return updated
	}

	const remove = async () => {
		if (!store.editingGroup) return false
		const res = await deleteGroup(store.editingGroup.id)
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
