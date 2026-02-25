'use client'

import { apiAction } from "@/lib/api/actions"
import { RESOURCES } from "@repo/constants"
import { DocumentSchema, CreateDocumentSchema } from "@repo/schemas"
import toast from "react-hot-toast"

interface CreateBookButtonProps {
  file: File | null
}

export function CreateBookButton({ file }: CreateBookButtonProps) {

    async function handleCreate() {
        const actionPromise = apiAction<DocumentSchema, CreateDocumentSchema>({
            method: 'post',
            url: '/documents',
            data: {
                filename: file?.name as string,
                path: "uploads" as string
            },
            successMessage: 'Documento criado com successo!',
            tags: [RESOURCES.DOCUMENTS]
        })
        const { data, message } = await toast.promise(actionPromise, {
            loading: 'Criando documento...'
        })
        data ? toast.success(message) : toast.error(message)
    }
    return (
        <button onClick={handleCreate}>
            Criar Livro
        </button>
    )
}