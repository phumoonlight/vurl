<script setup lang="ts">
import Draggable from 'vuedraggable'
import { DragChangeEvent } from '@/common/types'
import { useModal } from '@/common/modal'
import { useUrlQuery } from '@/common/urlquery'
import { GroupDocument } from '@/services/linkgroup/linkgroup.type'
import { useLinkGroup } from '@/services/linkgroup/linkgroup.hook'
import IconEdit from '@/components/icons/IconEdit.vue'
import ModalEditGroup from '@/components/modal/ModalEditGroup.vue'

const group = useLinkGroup()
const modal = useModal()
const queryGroupId = useUrlQuery('group')

const getRandomOrderBetween = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

const onClickEdit = (item: GroupDocument) => {
	group.editingGroup = item
	modal.show()
}

const onDragChange = (event: any) => {
	const typedEvent: DragChangeEvent = event
	const targetItem = typedEvent.moved.element
	const itemId = targetItem.id
	const newIndex = typedEvent.moved.newIndex
	const nextItem = group.groups[newIndex + 1]
	const prevItem = group.groups[newIndex + -1]
	let newOrder = 0
	if (!prevItem && nextItem) {
		newOrder = nextItem.order + 0.01
	} else if (prevItem && nextItem) {
		newOrder = getRandomOrderBetween(prevItem.order, nextItem.order)
	} else if (prevItem && !nextItem) {
		newOrder = prevItem.order - 0.01
	}
}
</script>

<template>
	<ModalEditGroup :modal="modal" />
	<div class="flex flex-col">
		<router-link
			to="/"
			class="group-item min-w-[200px] p-2 mb-4 bg-gray-700"
			:class="{ 'group-item-active': !queryGroupId }"
		>
			<strong class="font-serif tracking-wide">Main</strong>
		</router-link>
		<Draggable
			class="list max-h-[70vh] overflow-y-scroll pr-2"
			group="link-groups"
			item-key="id"
			:list="group.groups"
			@change="onDragChange"
		>
			<template #item="item">
				<div class="item relative">
					<router-link
						:to="`/?group=${item.element.id}`"
						class="group-item flex items-end bg-gray-700 min-w-[200px] p-1 h-[90px] bg-cover text-white mb-2"
						:class="{ 'group-item-active': item.element.id === queryGroupId }"
						:style="{
							backgroundImage: `url(${item.element.timg})`,
						}"
					>
						<div class="group-item-name drop-shadow-lg text-lg p-1 px-2">
							{{ item.element.title }}
						</div>
					</router-link>
					<div
						class="btn-edit p-2 bg-white rounded-full"
						@click="onClickEdit(item.element)"
					>
						<IconEdit class="text-black w-[20px] h-[20px]" />
					</div>
				</div>
			</template>
		</Draggable>
	</div>
</template>

<style scoped>
.group-item-name {
	background: rgba(54, 54, 54, 0.75);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}

.btn-edit {
	display: none;
	position: absolute;
	cursor: pointer;
	right: 5px;
	bottom: 5px;
}

.list {
	overflow-x: hidden;
}
.list::-webkit-scrollbar {
	width: 5px;
	background-color: #464646;
}

.list::-webkit-scrollbar-thumb {
	background: rgb(175, 175, 175);
}

::-webkit-scrollbar-thumb:hover {
	background: rgb(230, 230, 230);
}

.group-item {
	filter: brightness(0.8);
}

.group-item:hover {
	filter: brightness(0.9);
}

.group-item.group-item-active {
	filter: brightness(1);
}

.item:hover .btn-edit {
	display: flex;
}
</style>
