<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import validator from 'validator'
import { NModal, NInput, NButton, c } from 'naive-ui'
import { ModalController } from '../../hooks/modal'
import { createLink } from '../../services/links'
import { uploadImage } from '../../services/image'

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
const previewImageUrl = ref('')

const onSubmit = async () => {
	let thumbnail = inputImageUrl.value
	if (inputImageFile.value) {
		const res = await uploadImage(inputImageFile.value)
		if (!res) return
		thumbnail = res.uploadedUrl
	}
	await createLink({
		gid: route.query.group,
		timg: thumbnail,
		title: inputTitle.value,
		url: inputUrl.value,
	})
	props.modal.hide()
	emit('submit')
}

const onChangeInputImageFile = async (event: Event) => {
	const target = event.target as HTMLInputElement
	if (!target.files) {
		inputImageUrl.value = ''
		previewImageUrl.value = ''
		return
	}
	const file = target.files[0]
	if (!file) {
		inputImageUrl.value = ''
		previewImageUrl.value = ''
		return
	}
	inputImageUrl.value = ''
	previewImageUrl.value = URL.createObjectURL(file)
	inputImageFile.value = file
}

const onChangeInputImageUrl = (value: string) => {
	if (!validator.isURL(value)) {
		previewImageUrl.value = ''
		return
	}
	const img = new Image()
	img.src = value
	img.onload = () => {
		previewImageUrl.value = img.src
	}
	img.onerror = () => {
		previewImageUrl.value = ''
	}
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
		class="modal text-white p-10 w-[640px]"
		v-model:show="modal.isVisible"
	>
		<div>
			<div class="font-bold text-3xl mb-8 tracking-wide">Add link</div>

			<div class="flex">
				<div class="flex justify-center mr-4">
					<div
						v-if="!previewImageUrl"
						class="w-[200px] h-[300px] bg-gray-500 rounded-[20px] opacity-70"
					></div>
					<div v-if="previewImageUrl" class="w-[200px]">
						<img
							class="h-[300px] object-cover rounded-[20px]"
							:src="previewImageUrl"
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
						<input type="file" @change="onChangeInputImageFile" />
					</div>
				</div>
			</div>

			<div class="flex justify-end gap-4 mt-6">
				<NButton quaternary class="text-white" @click="modal.hide">
					Cancel
				</NButton>
				<NButton class="w-[120px] font-bold" type="primary" @click="onSubmit">
					Save
				</NButton>
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
