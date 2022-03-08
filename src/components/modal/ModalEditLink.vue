<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import validator from 'validator'
import { NModal, NInput, NButton, c } from 'naive-ui'
import { ModalController } from '../../hooks/modal'
import { BookmarkDoc, updateLink } from '../../services/links'
import { uploadImage } from '../../services/image'
import imageNoImage from '../../assets/no-image.png'

interface Props {
	modal: ModalController
	dataSource: BookmarkDoc | null
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
	if (!props.dataSource) return
	let thumbnail = inputImageUrl.value
	if (inputImageFile.value) {
		const res = await uploadImage(inputImageFile.value)
		if (!res) return
		thumbnail = res.uploadedUrl
	}
	await updateLink(props.dataSource.id, {
		gid: route.query.group,
		title: inputTitle.value,
		url: inputUrl.value,
		timg: thumbnail,
	})
	props.modal.hide()
	emit('submit')
}

const onChangeInputImageFile = (event: Event) => {
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

watchEffect(() => {
	if (!props.dataSource) return
	if (!props.modal.isVisible) return
	inputTitle.value = props.dataSource.title
	inputUrl.value = props.dataSource.url
	inputImageUrl.value = props.dataSource.timg
	previewImageUrl.value = props.dataSource.timg
	inputImageFile.value = null
})
</script>

<template>
	<NModal
		class="modal text-white p-10 w-[500px]"
		v-model:show="modal.isVisible"
	>
		<div>
			<div class="font-bold text-3xl mb-8 tracking-wide">Edit link</div>
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
