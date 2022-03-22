<script setup lang="ts">
import { watch } from 'vue'
import { NModal, NInput } from 'naive-ui'
import { ModalController } from '@/common/modal'
import { useLoading } from '@/common/loading'
import {
	useLinkGroup,
	useLinkGroupForm,
} from '@/services/linkgroup/linkgroup.hook'
import imageNoImage from '@/assets/no-image.png'

interface Props {
	modal: ModalController
}

const props = defineProps<Props>()
const loading = useLoading()
const group = useLinkGroup()
const form = useLinkGroupForm()

const onSubmit = async () => {
	if (loading.isLoading) return
	loading.start()
	const isSuccess = await form.create()
	loading.done()
	if (!isSuccess) return
	await group.fetchData()
	props.modal.hide()
}

watch(
	() => props.modal.isVisible,
	() => {
		form.clearInput()
	}
)
</script>

<template>
	<NModal
		class="modal text-white p-10 w-[500px]"
		v-model:show="modal.isVisible"
	>
		<div>
			<div class="font-bold text-3xl mb-8 tracking-wide">Add group</div>
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
					<label class="col-span-1" for="input-url">Description</label>
					<NInput
						class="col-span-4"
						id="input-url"
						placeholder=""
						v-model:value="form.description"
					/>
					<label class="col-span-1">Image</label>
					<div class="col-span-4 flex flex-col gap-1">
						<NInput placeholder="" v-model:value="form.imageUrl" />
						<div>OR</div>
						<input
							type="file"
							accept="image/*"
							@change="form.handleFileChange"
						/>
					</div>
				</div>
			</div>
			<div class="flex justify-end items-center mt-12">
				<button class="text-gray-400 mr-8" @click="modal.hide">Cancel</button>
				<button
					class="w-[100px] font-bold bg-green-500 rounded-full p-2 hover:bg-green-400"
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
