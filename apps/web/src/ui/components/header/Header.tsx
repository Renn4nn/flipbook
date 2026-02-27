import Logo from '@/ui/layout/logo'
import styles from './header.module.css'
import SideNavToggler from '../sidebar/SideNavToggler'
import Sidebar from '../sidebar/Sidebar'
import { Book, House } from 'lucide-react'

export default function Header() {
	return (
		<header className={styles['web-header']}>
			<SideNavToggler />
			<a href="/" className={styles.logo}>
				<Logo color="white" />
			</a>
			<Sidebar />
		</header>
	)
}
