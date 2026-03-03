import FlipBookPage from '@/ui/pages/FlipBookPage/FlipBookPage'

export default async function FlipBook({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	return <FlipBookPage id={id} />
}
