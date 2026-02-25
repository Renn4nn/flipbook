import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'CTD Flipbook',
	description:
		'CTD flipbook is a web page where you can read documents in an interactive way.'
}

import MainPage from '@/ui/layout/main/MainPage'
import FlipBookPage from '@/ui/pages/FlipBookPage/FlipBookPage'

export default function Home() {
	return (
		<MainPage>
			<FlipBookPage />
		</MainPage>
	)
}
