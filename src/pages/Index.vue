<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NPopover } from 'naive-ui'
import { useFirebaseSignedInUser } from '../services/firebase'
import { useBookmarks } from '../services/links'
import { useBookmarkGroups } from '../services/linkgroups'
import { cookie } from '../common/cookie'
import { useModal } from '../hooks/modal'
import ButtonSignInGoogle from '../components/button/ButtonSignInGoogle.vue'
import ButtonAddBookmark from '../components/button/ButtonAddBookmark.vue'
import ModalAddLink from '../components/modal/ModalAddLink.vue'
import ModalAddGroup from '../components/modal/ModalAddGroup.vue'

const route = useRoute()
const signedInUser = useFirebaseSignedInUser()
const links = useBookmarks()
const group = useBookmarkGroups()
const modalAddLink = useModal()
const modalAddGroup = useModal()
const isLoading = ref(true)

const isUserNotSignedIn = computed(() => {
	return !signedInUser.user.value && !signedInUser.isLoading.value
})

const groupId = computed(() => {
	return (route.query.group as string) || ''
})

const onClickSignOut = () => {
	signedInUser.signOut()
}

const onClickAdd = (key: string) => {
	if (key === 'link') modalAddLink.show()
	if (key === 'group') modalAddGroup.show()
}

const onSubmitAddLink = () => {
	modalAddLink.hide()
	links.fetchData(groupId.value)
}

const onSubmitAddGroup = () => {
	modalAddGroup.hide()
	group.fetchData()
}

watch(route, () => {
	links.fetchData(groupId.value)
})

watch(signedInUser.user, async (changedUser) => {
	if (!changedUser) return
	const token = await changedUser.getIdToken()
	cookie.setAccessToken(token)
	await links.fetchData(groupId.value)
	await group.fetchData()
	isLoading.value = false
})
</script>

<template>
	<div class="h-full">
		<nav v-if="signedInUser.user.value" class="border-b-[1px] border-gray-500">
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
								{{ signedInUser.user.value.displayName?.[0] }}
							</div>
						</template>
						<div>
							<div class="p-2 mb-4 opacity-75">
								{{ signedInUser.user.value.displayName }}
							</div>
							<div
								class="p-2 hover:bg-gray-300 cursor-pointer rounded-b"
								@click="onClickSignOut"
							>
								Sign out
							</div>
						</div>
					</NPopover>
				</div>
			</div>
		</nav>
		<div
			v-if="isUserNotSignedIn"
			class="flex justify-center items-center h-full"
		>
			<div class="flex flex-col items-center w-[300px]">
				<div
					class="text-6xl font-serif font-bold mb-4 tracking-widest uppercase"
				>
					vurl
				</div>
				<div class="opacity-70 font-serif mb-10">Visualize your saved link</div>
				<ButtonSignInGoogle class="mb-10" v-if="isUserNotSignedIn" />
				<a
					href="https://github.com/phumoonlight/vurl"
					target="_blank"
					rel="noopener noreferrer"
				>
					<NButton class="text-white font-mono hover:text-gray-400" quaternary>
						GitHub
					</NButton>
				</a>
			</div>
		</div>
		<div v-if="signedInUser.user.value" class="flex mt-4 gap-4">
			<div class="flex flex-col">
				<router-link
					to="/"
					class="group-item min-w-[200px] p-2 mb-4 bg-gray-700"
					:class="{ 'group-item-active': !groupId }"
				>
					<strong class="font-serif tracking-wide">Main</strong>
				</router-link>
				<router-link
					:to="`/?group=${item.id}`"
					v-for="item in group.data"
					class="group-item flex items-end bg-gray-700 min-w-[200px] p-2 h-[90px] bg-cover text-white mb-2"
					:class="{ 'group-item-active': item.id === groupId }"
					:style="{
						backgroundImage: `url(${item.timg})`,
					}"
				>
					<div class="drop-shadow-lg bg-black p-1">{{ item.title }}</div>
				</router-link>
			</div>
			<div
				v-if="!links.data.length && !isLoading"
				class="flex justify-center h-full items-center"
			>
				There aren't any links yet
			</div>
			<div class="grid grid-cols-4 gap-4 items-start">
				<a
					v-for="item in links.data"
					:key="item.id"
					:href="item.url"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img class="h-[200px] w-[300px] object-cover object-top" :src="item.timg" alt="" />
					<div class="p-2 pl-0 font-bold tracking-wide">{{ item.title }}</div>
				</a>
			</div>
		</div>
		<ModalAddLink :modal="modalAddLink" @submit="onSubmitAddLink" />
		<ModalAddGroup :modal="modalAddGroup" @submit="onSubmitAddGroup" />
	</div>
	<router-view></router-view>
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
