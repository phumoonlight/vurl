<script setup lang="ts">
import Draggable from 'vuedraggable'
import { BookmarkGroupDoc } from '../services/linkgroups'
import IconEdit from '../components/icons/IconEdit.vue'

interface Props {
	dataSource: BookmarkGroupDoc[]
	activeGroupId: string
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

const getRandomOrderBetween = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

const onClickEdit = (item: BookmarkGroupDoc) => {
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
	<div class="flex flex-col">
		<router-link
			to="/"
			class="group-item min-w-[200px] p-2 mb-4 bg-gray-700"
			:class="{ 'group-item-active': !activeGroupId }"
		>
			<strong class="font-serif tracking-wide">Main</strong>
		</router-link>
		<Draggable
			class="max-h-[75vh] overflow-scroll"
			v-model="dataSource"
			group="link-groups"
			item-key="id"
			@change="onChange"
		>
			<template #item="item">
				<router-link
					:to="`/?group=${item.element.id}`"
					class="group-item flex items-end bg-gray-700 min-w-[200px] p-2 h-[90px] bg-cover text-white mb-2"
					:class="{ 'group-item-active': item.element.id === activeGroupId }"
					:style="{
						backgroundImage: `url(${item.element.timg})`,
					}"
				>
					<div class="drop-shadow-lg bg-black p-1">
						{{ item.element.title }}
					</div>
				</router-link>
			</template>
		</Draggable>
	</div>
</template>

<style scoped>
.group-item {
	opacity: 0.75;
}

.group-item:hover {
	opacity: 0.9;
}

.group-item.group-item-active {
	opacity: 1;
}
</style>
