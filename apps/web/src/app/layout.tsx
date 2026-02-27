'use client'
import './globals.css'
import Header from '@/ui/components/header/Header'

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt">
			<body>{children}</body>
		</html>
	)
}
