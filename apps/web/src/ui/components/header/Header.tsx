import Logo from '../../layout/logo'
import styles from './header.module.css'
import SideNavToggler from '../sidebar/SideNavToggler'

export default function Header() {
	return (
		<header className={styles['web-header']}>
			<SideNavToggler />
			<a href="/">
				<Logo color="white" />
			</a>
			<div className={styles['button-group']}>
				<button type="button" className={styles.button}>
					Workspace
				</button>
				<button type="button" className={styles.button}>
					New Flipbook
				</button>
			</div>
		</header>
	)
}
