<script setup lang="ts">
import { ref } from 'vue'
import Draggable from 'vuedraggable'
import { BookmarkDoc } from '../services/links'
import imageNoImage from '../assets/no-image.png'
import IconEdit from '../components/icons/IconEdit.vue'
import { useModal } from '../hooks/modal'
import ModalEditLink from './modal/ModalEditLink.vue'

interface Props {
	dataSource: BookmarkDoc[]
}

interface DragChangeEvent {
	moved: {
		element: any
		newIndex: number
		oldIndex: number
	}
}

const emit = defineEmits(['reorder', 'editsubmit'])
const props = defineProps<Props>()
const modalEditLink = useModal()
const editingLink = ref<BookmarkDoc | null>(null)

const formatUrl = (url: string) => {
	const formattedUrl = url.replace(/^https?:\/\//, '').replace(/www./, '')
	return formattedUrl
}

const getNewOrderBetween = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

const onClickEdit = (item: BookmarkDoc) => {
	editingLink.value = item
	modalEditLink.show()
}

const onSubmitEdit = async () => {
	modalEditLink.hide()
	emit('editsubmit')
}

const onChange = (event: any) => {
	const FACTOR = 0.0000001
	const typedEvent: DragChangeEvent = event
	const targetItem = typedEvent.moved.element
	const itemId = targetItem.id
	const newIndex = typedEvent.moved.newIndex
	const behindItem = props.dataSource[newIndex + 1]
	const frontItem = props.dataSource[newIndex - 1]
	let newOrder = 0
	if (!frontItem && behindItem) {
		newOrder = behindItem.order + FACTOR
	} else if (frontItem && behindItem) {
		newOrder = getNewOrderBetween(behindItem.order, frontItem.order)
	} else if (frontItem && !behindItem) {
		newOrder = frontItem.order - FACTOR
	}
	emit('reorder', {
		itemId,
		newOrder: newOrder,
	})
}
</script>

<template>
	<ModalEditLink
		:modal="modalEditLink"
		:dataSource="editingLink"
		@submit="onSubmitEdit"
	/>
	<Draggable
		class="grid grid-cols-4 gap-4 items-start"
		group="links"
		item-key="id"
		:list="dataSource"
		@change="onChange"
	>
		<template #item="item">
			<div class="link-item relative">
				<a :href="item.element.url" target="_blank" rel="noopener noreferrer">
					<div>
						<img
							class="h-[200px] w-[300px] object-cover object-top"
							:src="item.element.timg || imageNoImage"
							alt=""
						/>
					</div>
					<div class="p-2 pl-0 font-bold tracking-wider text-lg truncate">
						{{ item.element.title }}
					</div>
				</a>
				<div class="absolute bottom-[50px] flex items-end justify-between w-full px-2">
					<div
						class="link-item-url truncate"
					>
						{{ formatUrl(item.element.url) }}
					</div>
					<div
						class="btn-edit p-2 bg-white rounded-full"
						@click="onClickEdit(item.element)"
					>
						<IconEdit class="text-black w-[20px] h-[20px]" />
					</div>
				</div>
			</div>
		</template>
	</Draggable>
</template>

<style scoped>
.link-item-url {
	display: none;
}
.btn-edit {
	cursor: pointer;
	display: none;
}

.link-item:hover .btn-edit,
.link-item:hover .link-item-url {
	display: block;
}

.link-item:hover img {
	filter: brightness(0.5);
}
</style>
