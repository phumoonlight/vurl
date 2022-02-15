<script setup lang="ts">
import { NButton } from 'naive-ui'
import { signOut } from '../../services/firebase'

const onClick = () => {
	signOut()
}
</script>

<template>
	<NButton class="text-white" @click="onClick">Sign out</NButton>
</template>
