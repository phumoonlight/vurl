<script setup lang="ts">
import { NConfigProvider, darkTheme } from 'naive-ui'
</script>

<template>
	<NConfigProvider :theme="darkTheme">
		<router-view></router-view>
	</NConfigProvider>
</template>

<style>
html,
body,
#app {
	height: 100%;
}

html {
	background: #0f1014;
}

#app {
	color: #ffffff;
}
</style>
