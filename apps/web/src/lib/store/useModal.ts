import { create } from 'zustand'

interface ModalState {
	modalId: string | null
	openModal: (id: string) => void
	closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
	modalId: null,
	openModal: (id) => set({ modalId: id }),
	closeModal: () => set({ modalId: null })
}))
