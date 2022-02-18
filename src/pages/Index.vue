<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NButton, NPopover } from 'naive-ui'
import { useFirebaseSignedInUser } from '../services/firebase'
import { useBookmarks } from '../services/links'
import { useBookmarkGroups } from '../services/linkgroups'
import { cookie } from '../common/cookie'
import { useModal } from '../hooks/modal'
import ButtonSignInGoogle from '../components/button/ButtonSignInGoogle.vue'
import ButtonAddBookmark from '../components/button/ButtonAddBookmark.vue'
import ModalAddBookmark from '../components/modal/ModalAddBookmark.vue'
import ModalAddGroup from '../components/modal/ModalAddGroup.vue'

const signedInUser = useFirebaseSignedInUser()
const bookmarks = useBookmarks()
const bookmarkGroups = useBookmarkGroups()
const modalAddBookmark = useModal()
const modalAddGroup = useModal()
const isLoading = ref(true)

const isUserNotSignedIn = computed(() => {
	return !signedInUser.user.value && !signedInUser.isLoading.value
})

const onClickSignOut = () => {
	signedInUser.signOut()
}

const onClickAdd = (key: string) => {
	if (key === 'bookmark') {
		modalAddBookmark.show()
		return
	}
	if (key === 'group') {
		modalAddGroup.show()
		return
	}
}

watch(signedInUser.user, async (changedUser) => {
	if (!changedUser) return
	const token = await changedUser.getIdToken()
	cookie.setAccessToken(token)
	await bookmarks.fetchData('')
	await bookmarkGroups.fetchData()
	isLoading.value = false
})
</script>

<template>
	<div class="h-full">
		<nav v-if="signedInUser.user.value">
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
							<img
								v-if="signedInUser.user.value.photoURL"
								class="h-12 w-12 rounded-full cursor-pointer hover:brightness-75"
								:src="signedInUser.user.value.photoURL"
								alt="avatar"
							/>
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
		<div v-if="signedInUser.user.value" class="flex mt-5 gap-3">
			<div class="flex flex-col">
				<router-link to="/" class="min-w-[200px] p-2 mb-2 bg-gray-700">
					<strong class="font-serif tracking-wide">Main</strong>
				</router-link>
				<router-link
					:to="`/?group=${item.id}`"
					v-for="item in bookmarkGroups.data"
					class="flex items-end bg-gray-700 min-w-[200px] p-2 h-[90px] bg-cover text-white"
					:style="{
						backgroundImage: `url(${item.timg})`,
					}"
				>
					<div class="drop-shadow-lg bg-black p-1">{{ item.title }}</div>
				</router-link>
			</div>
			<div
				v-if="!bookmarks.data.length && !isLoading"
				class="flex justify-center h-full items-center"
			>
				There aren't any bookmarks yet
			</div>
			<div class="flex gap-3">
				<a
					v-for="item in bookmarks.data"
					:key="item.id"
					:href="item.url"
					class="border"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img class="h-[150px]" :src="item.timg" alt="" />
					<div class="p-2">{{ item.title }}</div>
				</a>
			</div>

			<!-- <div class="flex justify-center gap-2">
				<NTag>Bookmark</NTag>
				<NTag>Twitter</NTag>
			</div>
			<div class="flex flex-col justify-center items-center min-h-[250px]">
				<div class="mb-2">You don't have any bookmarks</div>
				<div><NButton>Add bookmark</NButton></div>
			</div> -->
		</div>
		<ModalAddBookmark :modal="modalAddBookmark" />
		<ModalAddGroup :modal="modalAddGroup" />
	</div>
	<router-view></router-view>
</template>

<style>
html,
body,
#app {
	height: 100%;
}

#app {
	background: #0f1014;
	color: #ffffff;
}
</style>
