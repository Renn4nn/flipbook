'use client'

import { Menu } from 'lucide-react'
import './sidebar.css'

export default function SideNavToggler() {
	return (
		<button type="button" className="sidenav-toggler">
			<Menu />
		</button>
	)
}
