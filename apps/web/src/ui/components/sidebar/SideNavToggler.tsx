'use client'

import { ArrowDown } from 'lucide-react'
import './sidebar.css'
import { useSidebarStore } from '@/lib/store/useSidebarStore'

export default function SideNavToggler() {
	const { isOpen, open, close } = useSidebarStore()

	return (
		<button
			type="button"
			className="sidenav-toggler"
			onClick={isOpen ? close : open}
		>
			<ArrowDown color="#005ca9" strokeWidth={2} />
		</button>
	)
}
