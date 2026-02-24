import type { ChangeEvent, DragEventHandler, KeyboardEventHandler } from 'react'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import type { UseFilePickerParams, UseFilePickerReturn } from '../types/hooks'

export default function useFilePicker({ setFile }: UseFilePickerParams) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const clearFile = () => {
		setFile(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const setPdfFile = (file: File) => {
		if (file.type !== 'application/pdf') {
			toast.error('Apenas arquivos PDF são permitidos', {
				id: 'setPdfFileErrorToast'
			})
			clearFile()
		} else {
			setFile(file)
			toast.success('Arquivo PDF carregado com sucesso', {
				id: 'setPdfFileSuccessToast'
			})
		}
	}

	const handleClick = () => {
		if (fileInputRef.current) fileInputRef.current.click()
	}

	const fileInputHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (hasFiles(e.target.files)) {
			setPdfFile(e.target.files[0])
		}
	}

	const handleDragOver: DragEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop: DragEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault()
		e.stopPropagation()

		if (hasFiles(e.dataTransfer.files)) {
			setPdfFile(e.dataTransfer.files[0])
		}
	}

	const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault()
			handleClick()
		}
	}

	return {
		fileInputRef,
		clearFile,
		handleClick,
		fileInputHandleChange,
		handleDragOver,
		handleDrop,
		handleKeyDown
	} satisfies UseFilePickerReturn
}

function hasFiles(files: FileList | null | undefined): files is FileList {
	return !!(files && files.length > 0)
}
