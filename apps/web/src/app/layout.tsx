'use client'
import './globals.css'
import Header from '@/ui/components/header/Header'
import Modal from '@/ui/components/modal/Modal'
import MainPage from '@/ui/layout/main/MainPage'

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt">
			
			<body>
				<MainPage>
					<Modal />
					<Header />
					{children}
				</MainPage>
			</body>
		</html>
	)
}
