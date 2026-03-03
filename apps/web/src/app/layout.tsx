'use client'
import './globals.css'
import Header from '@/ui/components/header/Header'
import Modal from '@/ui/components/modal/Modal'
import MainPage from '@/ui/layout/main/MainPage'
import ModalFlipbook from '@/ui/components/modal/ModalFlipbook'

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt">
			<body>
				<MainPage>
					<Modal>
						<ModalFlipbook />
					</Modal>
					<Header />
					{children}
				</MainPage>
			</body>
		</html>
	)
}
