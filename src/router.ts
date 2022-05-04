import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
	{ path: '/', component: () => import('./pages/Index.vue') },
	{ path: '/app', component: () => import('./pages/App.vue') },
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})
