import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
	title: 'Entrar | CTD Flipbook',
	description: 'Acesse a biblioteca do CTD Flipbook'
}

export default function LoginPage() {
	return (
		<main>
			<LoginForm />
		</main>
	)
}
