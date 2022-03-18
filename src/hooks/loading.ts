import { reactive, ref } from 'vue'

export const useLoading = () => {
	const isLoading = ref(false)
	const start = () => (isLoading.value = true)
	const done = () => (isLoading.value = false)
	return reactive({
		isLoading,
		start,
		done,
	})
}
