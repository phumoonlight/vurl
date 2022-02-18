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
