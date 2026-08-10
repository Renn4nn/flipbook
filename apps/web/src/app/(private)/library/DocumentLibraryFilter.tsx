import { Files, Share2, UserRound } from 'lucide-react'
import styles from './library.module.css'

export type DocumentLibraryFilterValue = 'all' | 'owned' | 'shared'

type DocumentLibraryFilterOption = {
	value: DocumentLibraryFilterValue
	label: string
	count: number
	icon: typeof Files
}

type DocumentLibraryFilterProps = {
	value: DocumentLibraryFilterValue
	totalCount: number
	ownedCount: number
	sharedCount: number
	onChange: (value: DocumentLibraryFilterValue) => void
}

export default function DocumentLibraryFilter({
	value,
	totalCount,
	ownedCount,
	sharedCount,
	onChange
}: DocumentLibraryFilterProps) {
	const options: DocumentLibraryFilterOption[] = [
		{
			value: 'all',
			label: 'Todos',
			count: totalCount,
			icon: Files
		},
		{
			value: 'owned',
			label: 'Meus documentos',
			count: ownedCount,
			icon: UserRound
		},
		{
			value: 'shared',
			label: 'Compartilhados comigo',
			count: sharedCount,
			icon: Share2
		}
	]

	return (
		<div
			className={styles.filterGroup}
			role="tablist"
			aria-label="Filtrar documentos"
		>
			{options.map((option) => {
				const Icon = option.icon
				const isActive = option.value === value

				return (
					<button
						key={option.value}
						type="button"
						role="tab"
						aria-selected={isActive}
						className={`${styles.filterButton} ${
							isActive ? styles.filterButtonActive : ''
						}`}
						onClick={() => onChange(option.value)}
					>
						<Icon size={18} aria-hidden="true" />
						<span>{option.label}</span>
						<span className={styles.filterCount}>{option.count}</span>
					</button>
				)
			})}
		</div>
	)
}
