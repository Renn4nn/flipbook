'use client'

import { apiAction } from "@/lib/api/actions"
import { RESOURCES } from "@repo/constants"
import toast from "react-hot-toast"

interface CreateBookButtonProps {
  file: File | null
}

export function CreateBookButton({ file }: CreateBookButtonProps) {

    async function handleCreate() {
        const actionPromise = apiAction({
            method: 'post',
            url: '/documents',
            data: {
                filename: file?.name,
                path: "uploads"
            },
            successMessage: 'Documento criado com successo!',
            tags: [RESOURCES.DOCUMENTS]
        })
        await toast.promise(actionPromise, {
            loading: 'Criando documento...'
        })
    }
    return (
        <button onClick={handleCreate}>
            Criar Livro
        </button>
    )
}