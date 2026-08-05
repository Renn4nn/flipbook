import './globals.css'

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body suppressHydrationWarning>{children}</body>
		</html>
	)
}
