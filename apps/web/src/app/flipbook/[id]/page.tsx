import { API_ROUTES } from '@repo/constants'
import FlipBookPage from '@/ui/pages/FlipBookPage/FlipBookPage'
import { apiAction } from '@/lib/api/actions'
import toast from 'react-hot-toast'

export default async function FlipBook({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	const response = (
		await apiAction({
			method: 'get',
			url: `${API_ROUTES.DOCUMENTS.BASE}/${id}`,
			successMessage: 'Documento encontrado com sucesso'
		})
	).data

	if (!response) {
		return <div>Documento não encontrado</div>
	}

	console.log(response)

	return <FlipBookPage path={response?.path || ''} />
}
