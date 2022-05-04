<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NPopover } from 'naive-ui'
import { useFirebaseSignedInUser } from '@/services/firebase'
import { useLink } from '@/services/link/link.hook'
import { useLinkGroup } from '@/services/linkgroup/linkgroup.hook'
import { useModal } from '@/common/modal'
import { useUrlQuery } from '@/common/urlquery'
import { useGlobalLoading } from '@/common/loading'
import ButtonAddBookmark from '@/components/button/ButtonAddBookmark.vue'
import ModalAddLink from '@/components/modal/ModalAddLink.vue'
import ModalAddGroup from '@/components/modal/ModalAddGroup.vue'
import LinkList from '@/components/LinkList.vue'
import GroupList from '@/components/GroupList.vue'

const route = useRoute()
const router = useRouter()
const signedInUser = useFirebaseSignedInUser()
const modalAddLink = useModal()
const modalAddGroup = useModal()
const loading = useGlobalLoading()
const queryGroupId = useUrlQuery('group')
const link = useLink()
const linkGroup = useLinkGroup()

const viewingGroupName = computed(() => {
	if (loading.isLoading) return ''
	if (!queryGroupId.value) return 'Main'
	if (!linkGroup.viewingGroup) return 'Unknown Group'
	return linkGroup.viewingGroup.title
})

const viewingGroupDesc = computed(() => {
	if (loading.isLoading) return ''
	if (!queryGroupId.value) return ''
	if (!linkGroup.viewingGroup) return ''
	return linkGroup.viewingGroup.desc
})

const onClickSignOut = () => {
	signedInUser.signOut()
}

const onClickAdd = (key: 'link' | 'group') => {
	if (key === 'link') modalAddLink.show()
	if (key === 'group') modalAddGroup.show()
}

const onLinkCreated = (gid: string) => {
	if (queryGroupId.value === gid) return link.fetchData(gid)
	if (gid) return router.push(`/app?group=${gid}`)
	router.push('/app')
}

signedInUser.onSignIn(async () => {
	loading.start()
	await link.fetchData(queryGroupId.value)
	await linkGroup.fetchData()
	loading.done()
})

signedInUser.onSignOut(() => {
	router.replace('/')
})

watch(route, () => {
	link.fetchData(queryGroupId.value)
})
</script>

<template>
	<ModalAddLink :modal="modalAddLink" @created="onLinkCreated" />
	<ModalAddGroup :modal="modalAddGroup" />
	<div v-if="signedInUser.isSignedIn">
		<nav class="border-b-[1px] border-gray-500">
			<div class="flex justify-between items-center p-2">
				<div class="text-xl tracking-wider uppercase font-serif font-bold">
					vurl
				</div>
				<div>
					<ButtonAddBookmark @select="onClickAdd" />
				</div>
				<div class="flex items-center gap-8">
					<NPopover class="p-0" trigger="click">
						<template #trigger>
							<div
								class="bg-gray-500 p-2 rounded-full w-12 h-12 flex justify-center items-center cursor-pointer hover:brightness-75 text-2xl"
							>
								{{ signedInUser.user.displayName?.[0] }}
							</div>
						</template>
						<div>
							<div class="p-2 mb-4 opacity-75">
								{{ signedInUser.user.displayName }}
							</div>
							<div
								class="p-2 hover:bg-gray-600 cursor-pointer rounded-b"
								@click="onClickSignOut"
							>
								Sign out
							</div>
						</div>
					</NPopover>
				</div>
			</div>
		</nav>
		<div class="flex mt-4 gap-4 items-start">
			<GroupList />
			<div class="pr-4">
				<div class="mb-4">
					<div class="text-3xl p-2 font-bold tracking-wider">
						{{ viewingGroupName }}
					</div>
					<div class="pl-5 opacity-75">{{ viewingGroupDesc }}</div>
				</div>
				<LinkList />
			</div>
		</div>
	</div>
</template>
