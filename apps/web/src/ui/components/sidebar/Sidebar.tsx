'use client'
import { Book, House } from 'lucide-react'
import './sidebar.css'
import { useSidebarStore } from '@/lib/store/useSidebarStore'

export default function Sidebar() {
	const { isOpen } = useSidebarStore()

	return (
		<div className={`link-group ${isOpen ? 'show' : ''}`}>
			<a href="/" className="nav-link">
				<House size={20} />
				<span>Workspace</span>
			</a>
			<a href="/" className="nav-link">
				<Book size={20} />
				<span>New Flipbook</span>
			</a>
		</div>
	)
}
