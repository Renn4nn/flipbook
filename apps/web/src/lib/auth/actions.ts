'use server'

import { signInSchema } from '@repo/schemas'
import { redirect } from 'next/navigation'
import { authenticate, notifyBackendLogout } from './backend'
import { destroySession, establishSession, getRefreshToken } from './session'
import type { LoginActionState } from './types'

export async function loginAction(
	_state: LoginActionState,
	formData: FormData
): Promise<LoginActionState> {
	const result = signInSchema.safeParse({
		login: formData.get('login'),
		password: formData.get('password')
	})

	if (!result.success) {
		return {
			message: 'Revise os campos informados.',
			fieldErrors: result.error.flatten().fieldErrors
		}
	}

	const authentication = await authenticate(
		result.data.login,
		result.data.password
	)

	if (!authentication.success) {
		return { message: authentication.message }
	}

	await establishSession(authentication.session)
	redirect('/library')
}

export async function logoutAction(): Promise<void> {
	const refreshToken = await getRefreshToken()
	await notifyBackendLogout(refreshToken)
	await destroySession()
	redirect('/login')
}
