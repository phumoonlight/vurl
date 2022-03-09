<script setup lang="ts">
import Draggable from 'vuedraggable'
import { BookmarkDoc } from '../services/links'
import imageNoImage from '../assets/no-image.png'
import IconEdit from '../components/icons/IconEdit.vue'

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

const props = defineProps<Props>()
const emit = defineEmits(['edit', 'reorder'])

const formatUrl = (url: string) => {
	const formattedUrl = url.replace(/^https?:\/\//, '').replace(/www./, '')
	return formattedUrl
}

const getRandomOrderBetween = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

const onClickEdit = (item: BookmarkDoc) => {
	emit('edit', item)
}

const onChange = (event: any) => {
	const typedEvent: DragChangeEvent = event
	const targetItem = typedEvent.moved.element
	const itemId = targetItem.id
	const newIndex = typedEvent.moved.newIndex
	const nextItem = props.dataSource[newIndex + 1]
	const prevItem = props.dataSource[newIndex + -1]
	let newOrder = 0
	if (!prevItem && nextItem) {
		newOrder = nextItem.order + 0.01
	} else if (prevItem && nextItem) {
		newOrder = getRandomOrderBetween(prevItem.order, nextItem.order)
	} else if (prevItem && !nextItem) {
		newOrder = prevItem.order - 0.01
	}
	emit('reorder', {
		itemId,
		newOrder: newOrder,
	})
}
</script>

<template>
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
					<div class="p-2 pl-0 font-bold tracking-wider text-xl">
						{{ item.element.title }}
					</div>
				</a>
				<div
					class="link-item-url absolute bottom-[50px] left-2 w-[200px] truncate"
				>
					{{ formatUrl(item.element.url) }}
				</div>
				<div
					class="btn-edit absolute bottom-[50px] right-2 p-2 bg-white rounded-full"
					@click="onClickEdit(item.element)"
				>
					<IconEdit class="text-black w-[20px] h-[20px]" />
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
