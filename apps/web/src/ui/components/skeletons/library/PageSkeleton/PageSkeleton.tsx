import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton'
import styles from './PageSkeleton.module.css'

export const PageSkeleton = ({
	width,
	height
}: {
	width: number
	height: number
}) => (
	<div style={{ width, height }} className={styles.container}>
		<LoadingSkeleton />
	</div>
)
