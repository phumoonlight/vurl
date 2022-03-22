export const getFileFromEvent = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (!target.files) return null
	if (!target.files.length) return null
	const file = target.files[0]
	if (!file) return null
	return file
}
