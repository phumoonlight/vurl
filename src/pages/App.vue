<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFirebaseSignedInUser } from '@/services/firebase'
import { useLink } from '@/services/link/link.hook'
import { useLinkGroup } from '@/services/linkgroup/linkgroup.hook'
import { useModal } from '@/common/modal'
import { useUrlQuery } from '@/common/urlquery'
import { useGlobalLoading } from '@/common/loading'
import ButtonAddBookmark from '@/components/button/ButtonAddBookmark.vue'
import ModalAddLink from '@/components/modal/ModalAddLink.vue'
import ModalAddGroup from '@/components/modal/ModalAddGroup.vue'
import Navbar from '@/components/Navbar.vue'
import LinkList from '@/components/LinkList.vue'
import GroupList from '@/components/GroupList.vue'
// import IconEdit from '@/components/icons/IconEdit.vue'
import { GroupDocument } from '@/services/linkgroup/linkgroup.type'

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
	if (!queryGroupId.value) return ''
	if (!linkGroup.viewingGroup) return 'Unknown Group'
	return linkGroup.viewingGroup.name
})

const viewingGroupDesc = computed(() => {
	if (loading.isLoading) return ''
	if (!queryGroupId.value) return ''
	if (!linkGroup.viewingGroup) return ''
	return linkGroup.viewingGroup.desc
})

const onClickEdit = (item: GroupDocument | undefined) => {
	if (!item) return
	linkGroup.editingGroup = item
}

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
	<div class="bottom-4 right-4 fixed z-50">
		<ButtonAddBookmark @select="onClickAdd" />
	</div>
	<div v-if="signedInUser.isSignedIn">
		<Navbar
			:displayName="signedInUser.user?.displayName || ''"
			@signOut="signedInUser.signOut"
		/>
		<div class="flex mt-4 gap-4 items-start">
			<GroupList />
			<div class="pr-4">
				<div
					v-if="linkGroup.viewingGroup?.timg"
					class="h-[200px] overflow-hidden"
				>
					<img class="w-full" :src="linkGroup.viewingGroup?.timg" alt="" />
				</div>
				<div class="mb-4 pl-10 flex">
					<div>
						<div class="text-3xl p-2 font-bold tracking-wider">
							{{ viewingGroupName }}
						</div>
						<div class="pl-5 opacity-75">{{ viewingGroupDesc }}</div>
					</div>
					<div>
						<!-- <div
							class="btn-edit p-2 bg-white rounded-full"
							@click="onClickEdit(linkGroup.viewingGroup)"
						>
							<IconEdit class="text-black w-[20px] h-[20px]" />
						</div> -->
					</div>
				</div>
				<LinkList />
			</div>
		</div>
	</div>
</template>
