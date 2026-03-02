'use client'
import './globals.css'
import Header from '@/ui/components/header/Header'
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
					<Header />
					{children}
				</MainPage>
			</body>
		</html>
	)
}
