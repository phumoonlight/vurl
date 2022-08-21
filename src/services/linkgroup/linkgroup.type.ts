export interface GroupDocument {
	id: string
	uid: string
	name: string
	desc: string
	timg: string
	posn: number
}

export interface FormGroup {
	name: string
	description: string
	imageUrl: string
	imageFile: File | null
	previewImageUrl: string
	isImageUrlResolved: boolean
	clearInput: () => void
	create: () => Promise<boolean>
	update: () => Promise<Partial<GroupDocument> | null>
	remove: () => Promise<boolean>
	handleFileChange: (event: Event) => void
}
