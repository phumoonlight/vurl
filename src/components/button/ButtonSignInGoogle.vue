<script setup lang="ts">
import { signInWithGoogle } from '../../services/firebase'
</script>

<template>
	<button class="flex items-center p-3 rounded-md font-bold bg-white text-black hover:bg-gray-800 hover:text-white transition-all" @click="signInWithGoogle">
		<img
			class="h-6 w-6 mr-2"
			src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
		/>
		<div>Sign in with Google</div>
	</button>
</template>
