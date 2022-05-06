<script setup lang="ts">
import { NConfigProvider, darkTheme, NMessageProvider } from 'naive-ui'
</script>

<template>
	<NConfigProvider :theme="darkTheme">
		<NMessageProvider placement="bottom-left">
			<router-view></router-view>
		</NMessageProvider>
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
