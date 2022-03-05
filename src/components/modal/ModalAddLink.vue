<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { NModal, NInput, NButton } from 'naive-ui'
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
const inputFile = ref('')


const onSubmit = async () => {
	await createLink({
		gid: route.query.group,
		timg: inputImageUrl.value || inputFile.value,
		title: inputTitle.value,
		url: inputUrl.value,
	})
	props.modal.hide()
	emit('submit')
}

const onChange =async (event: Event) => {
	const target = event.target as HTMLInputElement
	if (!target.files) return
	const file = target.files[0]
	if (!file) return
	const res = await uploadImage(file)
	if (!res) return
	inputFile.value = res.uploadedUrl
}
</script>

<template>
	<NModal class="text-white" v-model:show="modal.isVisible">
		<div>
			<div>Add link to {{ route.query.group || 'Main' }}</div>
			<NInput placeholder="title" v-model:value="inputTitle" />
			<NInput placeholder="url" v-model:value="inputUrl" />
			<NInput placeholder="image" v-model:value="inputImageUrl" />
			<input type="file" @change="onChange">
			<NButton @click="onSubmit">Save</NButton>
			<img  v-if="inputFile" class="w-40" :src="inputFile" alt="">
		</div>
	</NModal>
</template>
