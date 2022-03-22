import validator from 'validator'

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