'use client'

import { Logo } from '@repo/ui/logo'
import Link from 'next/link'
import { useActionState } from 'react'
import { loginAction } from '@/lib/auth/actions'
import type { LoginActionState } from '@/lib/auth/types'
import styles from './login.module.css'
import { ArrowRightIcon } from 'lucide-react'

const INITIAL_STATE: LoginActionState = { message: null }

export default function LoginForm() {
	const [state, formAction, pending] = useActionState(
		loginAction,
		INITIAL_STATE
	)

	return (
		<div className={styles.page}>
			<section className={styles.card} aria-labelledby="login-title">
				<Link href="/" className={styles.brand} aria-label="Voltar ao início">
					<Logo />
				</Link>
				<div className={styles.heading}>
					<h1 id="login-title">Entrar</h1>
					<p>Acesse sua biblioteca de documentos.</p>
				</div>

				<form action={formAction} className={styles.form}>
					<label className={styles.field}>
						<span>Login</span>
						<input
							name="login"
							type="text"
							autoComplete="username"
							required
							aria-invalid={Boolean(state.fieldErrors?.login)}
						/>
						{state.fieldErrors?.login?.[0] && (
							<small>{state.fieldErrors.login[0]}</small>
						)}
					</label>

					<label className={styles.field}>
						<span>Senha</span>
						<input
							name="password"
							type="password"
							autoComplete="current-password"
							required
							aria-invalid={Boolean(state.fieldErrors?.password)}
						/>
						{state.fieldErrors?.password?.[0] && (
							<small>{state.fieldErrors.password[0]}</small>
						)}
					</label>

					{state.message && (
						<p className={styles.error} role="alert">
							{state.message}
						</p>
					)}

					<button type="submit" disabled={pending} className={styles.submit}>
						{pending ? 'Entrando...' : 'Entrar'}
					</button>

					<div className={styles.links}>
						<Link href="/" className={styles.link}>
							<ArrowRightIcon className={styles.arrowRightIcon} />
							Voltar para o início
						</Link>
					</div>
				</form>
			</section>
		</div>
	);
}
