import { GroupDocument } from '@/services/linkgroups'
import { reactive, ref } from 'vue'

const store = reactive({
	editingGroup: ref<GroupDocument | null>(null),
  groups: ref<GroupDocument[]>([])
})

export const useGlobalStore = () => store
