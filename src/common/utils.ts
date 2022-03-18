import validator from 'validator'

export const wait = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export const loadImage = (src: string) => {
	return new Promise<string>((resolve, reject) => {
		if (!validator.isURL(src)) {
			reject(new Error('invalid image url'))
			return
		}
		const img = new Image()
		img.src = src
		img.onload = () => resolve(src)
		img.onerror = () => reject(new Error('image load error'))
	})
}

export const getFileFromEvent = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (!target.files) return null
	if (!target.files.length) return null
	const file = target.files[0]
	if (!file) return null
	return file
}
