import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	User,
} from 'firebase/auth'
import { computed, reactive, ref } from 'vue'
import { cookie } from '@/common/cookie'

export type OnSignOut = () => void
export type OnSignIn = (user: User) => void

const firebaseConfig = {
	apiKey: 'AIzaSyCUfYJ_R_mrhRa2BZczAtH0SCQyG_Y7Gzk',
	authDomain: 'vurl-24886.firebaseapp.com',
	projectId: 'vurl-24886',
	storageBucket: 'vurl-24886.appspot.com',
	messagingSenderId: '113090692397',
	appId: '1:113090692397:web:11fb795334b42488693fa4',
	measurementId: 'G-370C05WNV1',
}

initializeApp(firebaseConfig)
getAnalytics()

export const firebaseAuth = getAuth()

export const getAuthUser = () => {
	return new Promise<User | null>((resolve) => {
		onAuthStateChanged(firebaseAuth, (user) => {
			console.log(user)
			resolve(user)
		})
	})
}

export const signInWithGoogle = async () => {
	const googleAuthProvider = new GoogleAuthProvider()
	const result = await signInWithPopup(firebaseAuth, googleAuthProvider)
	console.log(result)
}

const user = ref<User | null>(null)
const isLoading = ref(true)

export const useFirebaseSignedInUser = () => {
	const onSignInCallback = ref<OnSignIn>(() => {})
	const onSignOutCallback = ref<OnSignOut>(() => {})
	const isSignedIn = computed(() => !!user.value)
	const isSignOut = computed(() => !user.value && !isLoading.value)

	const authen = () => {
		return new Promise<boolean>((resolve) => {
			const unsub = onAuthStateChanged(
				firebaseAuth,
				(changedUser) => {
					resolve(!!changedUser)
					unsub()
				},
				() => {
					resolve(false)
					unsub()
				}
			)
		})
	}

	const signOut = () => {
		firebaseAuth.signOut()
	}

	const onSignIn = (callback: OnSignIn) => {
		onSignInCallback.value = callback
	}

	const onSignOut = (callback: OnSignOut) => {
		onSignOutCallback.value = callback
	}

	onAuthStateChanged(firebaseAuth, async (changedUser) => {
		user.value = changedUser
		isLoading.value = false
		if (changedUser) {
			onSignInCallback.value(changedUser)
			const token = await changedUser.getIdToken()
			cookie.setAccessToken(token)
			return
		}
		onSignOutCallback.value()
	})

	return reactive({
		isLoading,
		isSignedIn,
		isSignOut,
		user,
		authen,
		signOut,
		onSignIn,
		onSignOut,
	})
}
