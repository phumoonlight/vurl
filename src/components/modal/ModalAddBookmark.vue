<script setup lang="ts">
import { defineEmits } from 'vue'
import { NModal } from 'naive-ui'
import { ModalController } from '../../hooks/modal'

interface Props {
	modal: ModalController
}

defineProps<Props>()
defineEmits(['select'])
</script>

<template>
	<NModal class="text-white" v-model:show="modal.isVisible">
		<div>
			<div>Add bookmark</div>
		</div>
	</NModal>
</template>
