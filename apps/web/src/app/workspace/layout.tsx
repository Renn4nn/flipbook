'use client'
import '../globals.css'
import Header from '@/ui/components/header/Header'
import ModalFlipbook from '@/ui/components/modal/flipbook/ModalFlipbook'
import Modal from '@/ui/components/modal/Modal'
import MainPage from '@/ui/layout/main/MainPage'

export default function WorkspaceLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<MainPage>
			<Modal title="New Flipbook" id="new-flipbook" closeButton={true}>
				<ModalFlipbook />
			</Modal>
			<Header />
			{children}
		</MainPage>
	)
}
