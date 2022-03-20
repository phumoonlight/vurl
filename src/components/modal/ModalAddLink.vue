<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { NModal, NInput, NSelect } from 'naive-ui'
import { ModalController } from '@/hooks/modal'
import { useLinkForm } from '@/hooks/form'
import { useLoading } from '@/hooks/loading'
import { useUrlQuery } from '@/hooks/urlquery'
import imageNoImage from '@/assets/no-image.png'
import { useGlobalStore } from '@/hooks/store'

interface Props {
	modal: ModalController
}

const emit = defineEmits(['created'])
const props = defineProps<Props>()
const store = useGlobalStore()
const form = useLinkForm()
const loading = useLoading()
const queryGroupId = useUrlQuery('group')
const selectedGroup = ref('')

const groupOptions = computed(() => {
	return [
		{
			value: '',
			label: 'Main',
		},
		...store.groups.map((group) => ({
			value: group.id,
			label: group.title,
		})),
	]
})

const onSubmit = async () => {
	if (loading.isLoading) return
	loading.start()
	const isSuccess = await form.create(selectedGroup.value)
	loading.done()
	if (!isSuccess) return
	props.modal.hide()
	emit('created', selectedGroup.value)
}

watch(queryGroupId, (gid) => {
	selectedGroup.value = gid
})

watch(
	() => props.modal.isVisible,
	async (value) => {
		if (!value) return
		selectedGroup.value = queryGroupId.value
		form.name = ''
		form.url = ''
		form.imageUrl = ''
		form.imageFile = null
	}
)

onMounted(() => {
	selectedGroup.value = queryGroupId.value
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
							:src="form.previewImageUrl || imageNoImage"
							alt=""
						/>
					</div>
				</div>
				<div class="grid grid-cols-5 gap-4">
					<label class="col-span-1" for="input-url">Group</label>
					<div class="col-span-4">
						<NSelect
							class="col-span-4"
							v-model:value="selectedGroup"
							filterable
							placeholder="Please select a song"
							:options="groupOptions"
						/>
					</div>
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
			<div class="flex justify-end items-center mt-12">
				<button class="text-gray-400 mr-8" @click="modal.hide">Cancel</button>
				<button
					class="w-[100px] font-bold bg-green-500 rounded-full p-2 hover:bg-green-400 disabled:opacity-50 disabled:bg-green-500"
					:disabled="loading.isLoading"
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

label {
	padding-top: 5px;
}
</style>
