<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useFirebaseSignedInUser } from '@/services/firebase'
import { useRouter } from 'vue-router'

const signedInUser = useFirebaseSignedInUser()
const router = useRouter()

signedInUser.onSignOut(() => {
	router.replace('/')
})
</script>

<template>
	<div>
		<Navbar
			:displayName="signedInUser.user?.displayName || ''"
			@signOut="signedInUser.signOut"
		/>
		<div class="flex justify-center mt-10 text-7xl">Coming soon</div>
	</div>
</template>
