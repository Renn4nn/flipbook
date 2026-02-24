import { Toaster } from 'react-hot-toast'

export default function MainPage({ children }: { children: React.ReactNode }) {
	return (
		<main className="fullscreen">
			{children}
			<Toaster
				toastOptions={{
					success: {
						style: { backgroundColor: 'var(--success)', color: 'white' }
					},
					error: {
						style: { backgroundColor: 'var(--danger)', color: 'white' }
					}
				}}
			/>
		</main>
	)
}
