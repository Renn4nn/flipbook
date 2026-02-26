import Logo from '../logo'
import styles from './header.module.css'

export default function Header() {
	return (
		<header className={styles['web-header']}>
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
