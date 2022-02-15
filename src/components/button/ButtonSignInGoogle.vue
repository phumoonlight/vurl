<script setup lang="ts">
import { NButton } from 'naive-ui'
import { signInWithGoogle } from '../../services/firebase'

const onClick = () => {
	signInWithGoogle()
}
</script>

<template>
	<NButton class="bg-white" @click="onClick">
		<img
			class="h-5 w-5 mr-2"
			src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
		/>
		<div>Sign in with Google</div>
	</NButton>
</template>
