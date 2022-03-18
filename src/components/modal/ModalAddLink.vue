<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NModal, NInput } from 'naive-ui'
import { ModalController } from '../../hooks/modal'
import { createLink } from '../../services/links'
import { uploadImage } from '../../services/image'
import { getFileFromEvent, loadImage } from '../../common/utils'
import imageNoImage from '../../assets/no-image.png'

interface Props {
	modal: ModalController
}

const emit = defineEmits(['submit'])
const props = defineProps<Props>()
const route = useRoute()
const inputTitle = ref('')
const inputUrl = ref('')
const inputImageUrl = ref('')
const inputImageFile = ref<File | null>(null)
const isLoading = ref(false)
const previewImageUrl = ref('')

const onSubmit = async () => {
	if (isLoading.value) return
	isLoading.value = true
	let thumbnail = inputImageUrl.value
	if (inputImageFile.value) {
		const res = await uploadImage(inputImageFile.value)
		if (!res) {
			isLoading.value = false
			return
		}
		thumbnail = res.uploadedUrl
	}
	const resCreateLink = await createLink({
		gid: route.query.group,
		title: inputTitle.value,
		url: inputUrl.value,
		timg: thumbnail,
	})
	isLoading.value = false
	if (!resCreateLink) return
	props.modal.hide()
	emit('submit')
}

const onChangeInputImageFile = (event: Event) => {
	const file = getFileFromEvent(event)
	if (!file) {
		inputImageUrl.value = ''
		previewImageUrl.value = ''
		inputImageFile.value = null
		return
	}
	inputImageUrl.value = ''
	previewImageUrl.value = URL.createObjectURL(file)
	inputImageFile.value = file
}

const onChangeInputImageUrl = async (value: string) => {
	isLoading.value = true
	try {
		await loadImage(value)
		previewImageUrl.value = value
	} catch (error) {
		previewImageUrl.value = ''
	}
	isLoading.value = false
}

watch(props.modal, async () => {
	inputTitle.value = ''
	inputUrl.value = ''
	inputImageUrl.value = ''
	previewImageUrl.value = ''
})
</script>

<template>
	<NModal
		class="modal text-white p-10 w-[500px]"
		v-model:show="modal.isVisible"
	>
		<div>
			<div class="font-bold text-3xl mb-8 tracking-wide">Add link</div>
			<div class="flex flex-col gap-8">
				<div class="flex justify-center mr-4">
					<div class="w-[300px] h-[200px]">
						<img
							class="h-[200px] w-full object-cover object-top rounded-[20px]"
							:src="previewImageUrl || imageNoImage"
							alt=""
						/>
					</div>
				</div>
				<div class="grid grid-cols-5 gap-4 items-center">
					<label class="col-span-1" for="input-name">Name</label>
					<NInput
						class="col-span-4"
						id="input-name"
						placeholder=""
						v-model:value="inputTitle"
					/>
					<label class="col-span-1" for="input-url">URL</label>
					<NInput
						class="col-span-4"
						id="input-url"
						placeholder=""
						v-model:value="inputUrl"
					/>
					<label class="col-span-1">Image</label>
					<div class="col-span-4 flex flex-col gap-1">
						<NInput
							placeholder=""
							@input="onChangeInputImageUrl"
							v-model:value="inputImageUrl"
						/>
						<div>OR</div>
						<input
							type="file"
							@change="onChangeInputImageFile"
							accept="image/*"
						/>
					</div>
				</div>
			</div>
			<div class="flex justify-end items-center mt-12">
				<button class="text-gray-400 mr-8" @click="modal.hide">Cancel</button>
				<button
					class="w-[100px] font-bold bg-green-500 rounded-full p-2 hover:bg-green-400 disabled:opacity-50 disabled:bg-green-500"
					:disabled="isLoading"
					@click="onSubmit"
				>
					Save
				</button>
			</div>
		</div>
	</NModal>
</template>

<style scoped>
.modal {
	background: rgba(107, 107, 107, 0.5);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border-radius: 20px;
}
</style>
