import type { Dispatch, SetStateAction } from 'react'
import type { UseFilePickerReturn } from './hooks'

export type FilePickerProps = {
	file: File | null
	setFile: Dispatch<SetStateAction<File | null>>
}
export type DropZoneProps = Omit<UseFilePickerReturn, 'clearFile'> & {
	className?: string
}
