<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NModal, NInput, NPopconfirm } from 'naive-ui'
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

const emit = defineEmits(['edited'])
const props = defineProps<Props>()
const router = useRouter()
const loading = useLoading()
const form = useLinkGroupForm()
const group = useLinkGroup()
const isPopupVisible = ref(false)

const onSubmit = async () => {
	if (loading.isLoading) return
	if (!group.editingGroup) return
	loading.start()
	const result = await form.update()
	loading.done()
	if (!result) return
	group.localUpdate({
		...group.editingGroup,
		title: result.title || '',
		desc: result.desc || '',
		timg: result.timg || '',
	})
	props.modal.hide()
	emit('edited')
}

const onClickDelete = async () => {
	isPopupVisible.value = false
	if (!group.editingGroup) return
	if (loading.isLoading) return
	loading.start()
	const result = await form.remove()
	loading.done()
	if (!result) return
	group.editingGroup = null
	props.modal.hide()
	await group.fetchData()
	router.replace('/')
}

watch(
	() => props.modal.isVisible,
	(value) => {
		if (!value) return
		if (!group.editingGroup) return
		form.name = group.editingGroup.title
		form.description = group.editingGroup.desc
		form.imageUrl = group.editingGroup.timg
		form.imageFile = null
	}
)
</script>

<template>
	<NModal
		class="modal text-white p-10 w-[500px]"
		v-model:show="modal.isVisible"
	>
		<div>
			<div class="font-bold text-3xl mb-8 tracking-wide">Edit group</div>
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
							@change="form.handleFileChange"
							accept="image/*"
						/>
					</div>
				</div>
			</div>
			<div class="flex justify-between items-center mt-12">
				<div>
					<NPopconfirm v-model:show="isPopupVisible">
						<template #trigger>
							<button
								class="text-red-500 p-1 disabled:opacity-50"
								:disabled="loading.isLoading"
							>
								Delete
							</button>
						</template>
						<template #action>
							<button
								class="text-white font-bold p-1 disabled:opacity-50 bg-red-500 rounded-full px-4"
								:disabled="loading.isLoading"
								@click="onClickDelete"
							>
								Confirm delete
							</button>
						</template>
						<div v-if="group.editingGroup" class="flex gap-1">
							<span>All links in</span>
							<span class="font-bold">{{ group.editingGroup.title }}</span>
							<span>will be move to <span class="font-bold">Main</span></span>
						</div>
					</NPopconfirm>
				</div>
				<div>
					<button class="text-gray-400 mr-8" @click="modal.hide">Cancel</button>
					<button
						class="w-[100px] font-bold bg-green-500 rounded-full p-2 hover:bg-green-400"
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
