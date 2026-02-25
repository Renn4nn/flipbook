'use server'
interface CreateBookButtonProps {
  file: File | null
  type: string
}

export function CreateBookButton({ file, type }: CreateBookButtonProps) {
    return (
        <button>
            Criar Livro
        </button>
    )
}