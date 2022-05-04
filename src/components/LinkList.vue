<script setup lang="ts">
import Draggable from 'vuedraggable'
import { DragChangeEvent } from '@/common/types'
import { useModal } from '@/common/modal'
import { useUrlQuery } from '@/common/urlquery'
import { LinkDocument } from '@/services/link/link.type'
import { useLink } from '@/services/link/link.hook'
import { updateOrder } from '@/services/link/link.http'
import imageNoImage from '@/assets/no-image.png'
import IconEdit from '@/components/icons/IconEdit.vue'
import ModalEditLink from '@/components/modal/ModalEditLink.vue'
import { useGlobalLoading } from '@/common/loading'

const queryGroupId = useUrlQuery('group')
const globalLoading = useGlobalLoading()
const modal = useModal()
const link = useLink()

const formatUrl = (url: string) => {
	const formattedUrl = url.replace(/^https?:\/\//, '').replace(/www./, '')
	return formattedUrl
}

const getNewOrderBetween = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

const onClickEdit = (item: LinkDocument) => {
	link.editingLink = item
	modal.show()
}

const onSubmitEdit = async () => {
	modal.hide()
	link.fetchData(queryGroupId.value)
}

const onChange = (event: any) => {
	const FACTOR = 0.0000001
	const typedEvent: DragChangeEvent = event
	const targetItem = typedEvent.moved.element
	const itemId = targetItem.id
	const newIndex = typedEvent.moved.newIndex
	const behindItem = link.links[newIndex + 1]
	const frontItem = link.links[newIndex - 1]
	let newOrder = 0
	if (!frontItem && behindItem) {
		newOrder = behindItem.order + FACTOR
	} else if (frontItem && behindItem) {
		newOrder = getNewOrderBetween(behindItem.order, frontItem.order)
	} else if (frontItem && !behindItem) {
		newOrder = frontItem.order - FACTOR
	}
	updateOrder(itemId, newOrder)
}
</script>

<template>
	<ModalEditLink
		:modal="modal"
		:dataSource="link.editingLink"
		@submit="onSubmitEdit"
	/>
	<div
		v-if="!link.links.length && !globalLoading.isLoading"
		class="flex justify-center h-full items-center"
	>
		There aren't any links yet
	</div>
	<Draggable
		class="grid grid-cols-4 gap-4 items-start"
		group="links"
		item-key="id"
		:list="link.links"
		@change="onChange"
	>
		<template #item="item">
			<div class="link-item relative">
				<a :href="item.element.url" target="_blank" rel="noopener noreferrer">
					<div>
						<img
							class="h-[200px] w-full object-cover object-top"
							:src="item.element.timg || imageNoImage"
							alt=""
						/>
					</div>
					<div class="p-2 pl-0 font-bold tracking-wider text-lg break-all">
						{{ item.element.title }}
					</div>
				</a>
				<div
					class="absolute bottom-[50px] flex items-end justify-between w-full px-2"
				>
					<div class="link-item-url truncate">
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
