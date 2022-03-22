export interface GroupDocument {
	id: string
	uid: string
	title: string
	desc: string
	timg: string
	order: number
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