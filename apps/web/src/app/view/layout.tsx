import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
	title: 'Visualizar Documento',
	description: 'Visualização de documento'
}

export default function ViewLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>{children}</div>
	)
}
