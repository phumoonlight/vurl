<script setup lang="ts">
import { watchEffect } from 'vue'
import { NModal, NInput } from 'naive-ui'
import { ModalController } from '../../hooks/modal'
import { useLoading } from '../../hooks/loading'
import { useLinkForm } from '../../hooks/form'
import { BookmarkDoc } from '../../services/links'
import imageNoImage from '../../assets/no-image.png'

interface Props {
	modal: ModalController
	dataSource: BookmarkDoc | null
}

const emit = defineEmits(['submit'])
const props = defineProps<Props>()
const loading = useLoading()
const form = useLinkForm()

const onSubmit = async () => {
	if (loading.isLoading) return
	if (!props.dataSource) return
	loading.start()
	const isSuccess = await form.update()
	loading.done()
	if (!isSuccess) return
	props.modal.hide()
	emit('submit')
}

const onClickDelete = async () => {
	if (loading.isLoading) return
	if (!props.dataSource) return
	loading.start()
	const isSuccess = await form.remove()
	loading.done()
	if (!isSuccess) return
	props.modal.hide()
	emit('submit')
}

watchEffect(() => {
	if (!props.dataSource) return
	if (!props.modal.isVisible) return
	form.linkId = props.dataSource.id
	form.name = props.dataSource.title
	form.url = props.dataSource.url
	form.imageUrl = props.dataSource.timg
	form.imageFile = null
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
							:src="form.previewImageUrl || imageNoImage"
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
						v-model:value="form.name"
					/>
					<label class="col-span-1" for="input-url">URL</label>
					<NInput
						class="col-span-4"
						id="input-url"
						placeholder=""
						v-model:value="form.url"
					/>
					<label class="col-span-1">Image</label>
					<div class="col-span-4 flex flex-col gap-1">
						<NInput placeholder="" v-model:value="form.imageUrl" />
						<div>OR</div>
						<input
							type="file"
							@change="form.handleFileChange"
							accept="image/*"
						/>
					</div>
				</div>
			</div>
			<div class="flex justify-between items-center gap-4 mt-12">
				<div>
					<button
						class="text-red-500 p-1 disabled:opacity-50"
						:disabled="loading.isLoading"
						@click="onClickDelete"
					>
						Delete
					</button>
				</div>
				<div>
					<button
						class="text-gray-400 mr-8 disabled:opacity-50"
						:disabled="loading.isLoading"
						@click="modal.hide"
					>
						Cancel
					</button>
					<button
						class="w-[100px] font-bold bg-green-500 rounded-full p-2 hover:bg-green-400 disabled:opacity-50"
						:disabled="loading.isLoading"
						@click="onSubmit"
					>
						Save
					</button>
				</div>
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
