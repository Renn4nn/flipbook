import Header from '@/ui/components/header/Header'
import Sidebar from '@/ui/components/sidebar/Sidebar'

export default function NavegationLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Header />
			{children}
		</>
	)
}
