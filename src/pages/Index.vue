<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFirebaseSignedInUser } from '@/services/firebase'
import ButtonSignInGoogle from '@/components/button/ButtonSignInGoogle.vue'

const router = useRouter()
const signedInUser = useFirebaseSignedInUser()

signedInUser.onSignIn(() => {
	router.replace('/app')
})
</script>

<template>
	<div v-if="signedInUser.isLoading" class="flex justify-center mt-10">
		Authenticate...
	</div>
	<div
		v-if="signedInUser.isSignOut"
		class="flex justify-center items-center h-[100vh]"
	>
		<div class="flex flex-col items-center w-[300px]">
			<div class="text-6xl font-serif font-bold mb-4 tracking-widest uppercase">
				vurl
			</div>
			<div class="opacity-70 font-serif mb-10">Visualize your saved link.</div>
			<ButtonSignInGoogle class="mb-10" />
			<a
				class="font-bold hover:underline"
				href="https://github.com/phumoonlight/vurl"
				target="_blank"
				rel="noopener noreferrer"
			>
				GitHub
			</a>
		</div>
	</div>
</template>
