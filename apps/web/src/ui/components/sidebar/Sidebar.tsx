'use client'
import { Book, LogOut } from 'lucide-react'
import './sidebar.css'
import { logoutAction } from '@/lib/auth/actions'
import { useModalStore } from '@/lib/store/useModal'
import { useSidebarStore } from '@/lib/store/useSidebarStore'

export default function Sidebar() {
	const { isOpen } = useSidebarStore()
	const { openModal } = useModalStore()

	return (
		<div className={`link-group ${isOpen ? 'show' : ''}`}>
			<button
				type="button"
				className="nav-link"
				onClick={() => openModal('new-flipbook')}
			>
				<Book size={20} />
				<span>New Flipbook</span>
			</button>
			<form action={logoutAction}>
				<button type="submit" className="nav-link">
					<LogOut size={20} />
					<span>Sair</span>
				</button>
			</form>
		</div>
	)
}
