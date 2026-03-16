'use client'
import { Book, House } from 'lucide-react'
import './sidebar.css'
import { useModalStore } from '@/lib/store/useModal'
import { useSidebarStore } from '@/lib/store/useSidebarStore'

export default function Sidebar() {
	const { isOpen } = useSidebarStore()
	const { openModal } = useModalStore()

	return (
		<div className={`link-group ${isOpen ? 'show' : ''}`}>
			<a href="/" className="nav-link">
				<House size={20} />
				<span>Workspace</span>
			</a>
			<button type="button" className="nav-link" onClick={openModal}>
				<Book size={20} />
				<span>New Flipbook</span>
			</button>
		</div>
	)
}
