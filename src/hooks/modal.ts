import { reactive, ref } from 'vue'

export interface ModalController {
	isVisible: boolean
	show: () => void
	hide: () => void
}

export const useModal = (): ModalController => {
	const isVisible = ref(false)

	const show = () => {
		isVisible.value = true
	}

	const hide = () => {
		isVisible.value = false
	}

	return reactive({
		isVisible,
		show,
		hide,
	})
}
