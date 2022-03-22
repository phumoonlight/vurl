import { reactive, ref } from 'vue'

const isLoadingGlobal = ref(false)

export const useGlobalLoading = () => {
	const start = () => (isLoadingGlobal.value = true)
	const done = () => (isLoadingGlobal.value = false)
	return reactive({
		isLoading: isLoadingGlobal,
		start,
		done,
	})
}

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
