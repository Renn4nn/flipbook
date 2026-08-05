import FlipBookViewer from './FlipBookViewer'

type DocumentProps = {
	file: File
}

export default function FlipBookLayoutPreview({ file }: DocumentProps) {
	return <FlipBookViewer file={file} embedded />
}
