// Componente principal - lazy loaded por padrão
export { default } from './FlipBook'

// Hooks reutilizáveis
export { useMediaQuery, useFlipbookAudio } from './hooks'

// Componentes individuais (para casos de uso específico)
export { FlipButton, Paper } from './components'

// Tipos
export type { FlipBookType } from './type'
