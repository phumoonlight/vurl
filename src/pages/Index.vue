<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseSignedInUser } from '@/services/firebase'
import { cookie } from '@/common/cookie'
import { useGlobalLoading } from '@/common/loading'
import ButtonSignInGoogle from '@/components/button/ButtonSignInGoogle.vue'

const router = useRouter()
const loading = useGlobalLoading()
const signedInUser = useFirebaseSignedInUser()

const isUserNotSignedIn = computed(() => {
	return !signedInUser.user.value && !signedInUser.isLoading.value
})

watch(signedInUser.user, async (changedUser) => {
	if (!changedUser) return
	loading.start()
	const token = await changedUser.getIdToken()
	cookie.setAccessToken(token)
	router.replace('/app')
	loading.done()
})
</script>

<template>
	<div
		v-if="isUserNotSignedIn"
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
