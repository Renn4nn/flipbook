import { create } from 'zustand'

interface FlipbookState {
	currentPage: number
	totalPages: number
	isCoverOpen: boolean
	setCurrentPage: (page: number) => void
	setTotalPages: (pages: number) => void
	setCoverOpen: (open: boolean) => void
	goToPage: (page: number) => void
}

export const useFlipbookStore = create<FlipbookState>((set) => ({
	currentPage: 0,
	totalPages: 0,
	isCoverOpen: false,
	setCurrentPage: (page) => set({ currentPage: page }),
	setTotalPages: (pages) => set({ totalPages: pages }),
	setCoverOpen: (open) => set({ isCoverOpen: open }),
	goToPage: (page) => set({ currentPage: page })
}))
