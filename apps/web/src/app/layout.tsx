'use client'
import './globals.css'
import Header from '@/ui/layout/header/Header'

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt">
			<body>
				<Header />
				{children}
			</body>
		</html>
	)
}
