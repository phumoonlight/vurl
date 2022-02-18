<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { NModal, NInput, NButton } from 'naive-ui'
import { ModalController } from '../../hooks/modal'
import { createLink } from '../../services/links'

interface Props {
	modal: ModalController
}

const emit = defineEmits(['submit'])
const props = defineProps<Props>()
const route = useRoute()
const inputTitle = ref('')
const inputUrl = ref('')
const inputImageUrl = ref('')

const onSubmit = async () => {
	await createLink({
		gid: route.query.group,
		timg: inputImageUrl.value,
		title: inputTitle.value,
		url: inputUrl.value,
	})
	props.modal.hide()
	emit('submit')
}
</script>

<template>
	<NModal class="text-white" v-model:show="modal.isVisible">
		<div>
			<div>Add link to {{ route.query.group || 'Main' }}</div>
			<NInput placeholder="title" v-model:value="inputTitle" />
			<NInput placeholder="url" v-model:value="inputUrl" />
			<NInput placeholder="image" v-model:value="inputImageUrl" />
			<NButton @click="onSubmit">Save</NButton>
		</div>
	</NModal>
</template>
