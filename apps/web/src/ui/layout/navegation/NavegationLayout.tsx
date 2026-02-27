import Header from '../../components/header/Header'
import Sidebar from '../../components/sidebar/Sidebar'

export default function NavegationLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Header />
			<Sidebar />
			{children}
		</>
	)
}
