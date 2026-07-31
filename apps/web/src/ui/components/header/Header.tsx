import Link from 'next/link'
import { useFullscreenStore } from '@/lib/store/useFullScreen'
import Logo from '@/ui/layout/logo'
import Sidebar from '../sidebar/Sidebar'
import SideNavToggler from '../sidebar/SideNavToggler'
import styles from './header.module.css'

export default function Header() {
	const { isFullscreen } = useFullscreenStore()

	if (isFullscreen) return null

	return (
		<header className={styles['web-header']}>
			<SideNavToggler />
			<Link href="/" className={styles.logo}>
				<Logo color={'#005ca9'} className={styles['logo-svg']} />
			</Link>
			<Sidebar />
		</header>
	)
}
