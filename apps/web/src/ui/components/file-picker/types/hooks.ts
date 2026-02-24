import type {
	ChangeEvent,
	DragEventHandler,
	KeyboardEventHandler,
	RefObject
} from 'react'
import type { FilePickerProps } from './components'

export type UseFilePickerParams = {
	setFile: FilePickerProps['setFile']
}

export type UseFilePickerReturn = {
	fileInputRef: RefObject<HTMLInputElement | null>
	clearFile: () => void
	handleClick: () => void
	fileInputHandleChange: (e: ChangeEvent<HTMLInputElement>) => void
	handleDragOver: DragEventHandler<HTMLButtonElement>
	handleDrop: DragEventHandler<HTMLButtonElement>
	handleKeyDown: KeyboardEventHandler<HTMLButtonElement>
}
