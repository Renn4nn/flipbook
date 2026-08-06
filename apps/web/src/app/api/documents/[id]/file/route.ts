import { API_ROUTES } from '@repo/constants'
import { type NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/auth/config'
import { getAccessToken, renewSession } from '@/lib/auth/session'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	let accessToken = await getAccessToken()

	let response = await fetchDocument(id, accessToken, request)
	if (response.status === 401 && accessToken) {
		accessToken = (await renewSession()) ?? undefined
		response = await fetchDocument(id, accessToken, request)
	}

	if (!response.ok || !response.body) {
		return NextResponse.json(
			{ error: 'Não foi possível carregar o documento.' },
			{ status: response.status }
		)
	}

	const headers = new Headers()
	for (const name of [
		'content-type',
		'content-length',
		'content-disposition',
		'accept-ranges',
		'content-range'
	]) {
		const value = response.headers.get(name)
		if (value) headers.set(name, value)
	}
	headers.set('Cache-Control', 'private, no-store')

	return new NextResponse(response.body, {
		status: response.status,
		headers
	})
}

function fetchDocument(
	id: string,
	accessToken: string | undefined,
	request: NextRequest
): Promise<Response> {
	const range = request.headers.get('range')
	return fetch(`${API_BASE_URL}${API_ROUTES.DOCUMENTS.FILE(id)}`, {
		headers: {
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...(range ? { Range: range } : {})
		},
		cache: 'no-store'
	})
}
