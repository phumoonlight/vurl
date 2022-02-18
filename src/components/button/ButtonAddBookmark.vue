<script setup lang="ts">
import { NPopover } from 'naive-ui'

const emit = defineEmits(['select'])

const onSelect = (key: string) => {
	emit('select', key)
}
</script>

<template>
	<NPopover class="p-0" trigger="focus">
		<template #trigger>
			<button
				class="flex justify-center items-center text-white rounded-full bg-blue-600 font-bold w-12 h-12 text-2xl hover:brightness-90"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
			</button>
		</template>
		<div class="w-[200px]">
			<div class="p-2 opacity-90">Add</div>
			<div
				class="p-2 hover:bg-gray-300 cursor-pointer text-lg font-semibold"
				@click="emit('select', 'link')"
			>
				Link
			</div>
			<div
				class="p-2 hover:bg-gray-300 cursor-pointer text-lg font-semibold"
				@click="emit('select', 'group')"
			>
				Group
			</div>
		</div>
	</NPopover>
</template>
