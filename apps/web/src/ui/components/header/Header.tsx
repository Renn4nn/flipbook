import Logo from '@/ui/layout/logo'
import styles from './header.module.css'
import SideNavToggler from '../sidebar/SideNavToggler'
import Sidebar from '../sidebar/Sidebar'
import Link from 'next/link'

export default function Header() {
	return (
		<header className={styles['web-header']}>
			<SideNavToggler />
			<Link href="/" className={styles.logo}>
				<Logo color="white" />
			</Link>
			<Sidebar />
		</header>
	)
}
