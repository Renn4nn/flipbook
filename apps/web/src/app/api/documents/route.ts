import { API_ROUTES } from '@repo/constants'
import { type NextRequest, NextResponse } from 'next/server'
import { validateAccessToken } from '@/lib/auth/backend'
import { API_BASE_URL } from '@/lib/auth/config'
import { getAccessToken, renewSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
	const contentType = request.headers.get('content-type')
	if (!contentType?.startsWith('multipart/form-data') || !request.body) {
		return NextResponse.json(
			{ error: { message: 'Arquivo de upload inválido.' } },
			{ status: 400 }
		)
	}

	let accessToken = await getAccessToken()
	if (accessToken) {
		const validation = await validateAccessToken(accessToken)
		if (validation === 'invalid') {
			accessToken = (await renewSession()) ?? undefined
		}
	} else {
		accessToken = (await renewSession()) ?? undefined
	}

	if (!accessToken) {
		return NextResponse.json(
			{ error: { message: 'Sessão expirada. Faça login novamente.' } },
			{ status: 401 }
		)
	}

	const headers = new Headers({
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': contentType
	})
	const contentLength = request.headers.get('content-length')
	if (contentLength) headers.set('Content-Length', contentLength)

	try {
		const response = await fetch(
			`${API_BASE_URL}${API_ROUTES.DOCUMENTS.BASE}`,
			{
				method: 'POST',
				headers,
				body: request.body,
				duplex: 'half',
				signal: request.signal,
				cache: 'no-store'
			} as RequestInit & { duplex: 'half' }
		)

		return new NextResponse(response.body, {
			status: response.status,
			headers: {
				'Content-Type':
					response.headers.get('content-type') ?? 'application/json'
			}
		})
	} catch {
		return NextResponse.json(
			{ error: { message: 'Não foi possível enviar o documento.' } },
			{ status: 502 }
		)
	}
}
