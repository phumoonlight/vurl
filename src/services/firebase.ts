import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	User,
} from 'firebase/auth'
import { ref } from 'vue'

const firebaseConfig = {
	apiKey: 'AIzaSyDqCLpaTOaUbfI7RoCTI3l1vLN1gwPTYec',
	authDomain: 'bookmark-85472.firebaseapp.com',
	projectId: 'bookmark-85472',
	storageBucket: 'bookmark-85472.appspot.com',
	messagingSenderId: '474262333093',
	appId: '1:474262333093:web:0d2ba836bbd8553fd14f4c',
	measurementId: 'G-VHT2HLTFB2',
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

export const signOut = () => {
	firebaseAuth.signOut()
}

export const useFirebaseSignedInUser = () => {
	const isLoading = ref(true)
	const user = ref<User | null>(null)

	onAuthStateChanged(firebaseAuth, (changedUser) => {
		user.value = changedUser
		isLoading.value = false
	})

	const signOut = () => {
		firebaseAuth.signOut()
	}

	return {
		isLoading,
		user,
		signOut,
	}
}
