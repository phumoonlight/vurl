import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const useUrlQuery = (name: string) => {
	const route = useRoute()
	const queryValue = computed(() => {
		return (route.query[name] || '') as string
	})
	return queryValue
}
