import { useId } from 'react'
import styles from './library-skeleton.module.css'

export default function LibrarySkeleton() {
	const baseId = useId()
	const skeletonItems = Array.from({ length: 5 }, (_, index) => ({
		id: `${baseId}-item-${index}`
	}))

	return (
		<div className={styles.container}>
			<div className={styles.grid}>
				{skeletonItems.map((item) => (
					<div key={item.id} className={styles.card}>
						<div className={styles.cardHeader}>
							<div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
							<div className={`${styles.skeleton} ${styles.skeletonText}`} />
						</div>
						<div className={styles.cardBody}>
							<div className={`${styles.skeleton} ${styles.skeletonImage}`} />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
