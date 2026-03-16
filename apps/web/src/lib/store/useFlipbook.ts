import { create } from 'zustand'

interface FlipbookState {
	currentPage: number
	totalPages: number
	isCoverOpen: boolean
	setCurrentPage: (page: number) => void
	setTotalPages: (pages: number) => void
	setCoverOpen: (open: boolean) => void
	goToPage: (page: number) => void
	reset: () => void
}

export const useFlipbookStore = create<FlipbookState>((set) => ({
	currentPage: 0,
	totalPages: 0,
	isCoverOpen: false,
	setCurrentPage: (page) => set({ currentPage: page }), // define a página atual
	setTotalPages: (pages) => set({ totalPages: pages }), // define o total de páginas
	setCoverOpen: (open) => set({ isCoverOpen: open }), // opcional para saber se a capa está aberta
	goToPage: (page) => set({ currentPage: page }), // vai para uma página específica
	reset: () =>
		set({
			currentPage: 0,
			totalPages: 0,
			isCoverOpen: false
		})
}))
