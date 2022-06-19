<script setup lang="ts">
import { NPopover } from 'naive-ui'
import imgLogo from '@/assets/logo.png'
import IconSearch from '@/components/icons/IconSearch.vue'

interface Props {
	displayName: string
}

const props = defineProps<Props>()
const emit = defineEmits(['signOut'])
</script>
<template>
	<nav class="border-b-[1px] border-gray-500">
		<div class="flex justify-between items-center p-3">
			<div class="flex items-center">
				<router-link
					to="/app"
					class="text-xl tracking-wider uppercase font-serif font-bold mr-4 px-4"
				>
					<img :src="imgLogo" class="w-8" />
				</router-link>
				<div class="flex items-center mr-4 bg-slate-800 p-1 px-2 rounded-md">
					<IconSearch class="mr-1" />
					<input
						type="search"
						class="bg-transparent p-1 outline-none"
						placeholder="Search"
					/>
				</div>
				<router-link to="/explore" class="mr-4"> Explore</router-link>
				<!-- <router-link to="/" class=""> ...</router-link> -->
			</div>
			<div class="flex items-center gap-8">
				<NPopover class="p-0" trigger="click">
					<template #trigger>
						<div
							class="bg-gray-500 p-2 rounded-full w-12 h-12 flex justify-center items-center cursor-pointer hover:brightness-75 text-2xl"
						>
							{{ props.displayName[0] }}
						</div>
					</template>
					<div>
						<div class="p-2 mb-4 opacity-75">
							{{ props.displayName }}
						</div>
						<div
							class="p-2 hover:bg-gray-600 cursor-pointer rounded-b"
							@click="emit('signOut')"
						>
							Sign out
						</div>
					</div>
				</NPopover>
			</div>
		</div>
	</nav>
</template>

<!-- <style scoped>
.router-link-active {
	background: #1f944a;
}
</style> -->
