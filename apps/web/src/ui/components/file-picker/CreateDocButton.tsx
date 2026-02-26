'use client'

import { apiAction } from "@/lib/api/actions"
import { RESOURCES } from "@repo/constants"
import { type DocumentSchema, CreateDocumentSchema } from "@repo/schemas"
import toast from "react-hot-toast"

interface CreateBookButtonProps {
  file: File | null
}

export function CreateBookButton({ file }: CreateBookButtonProps) {

    async function handleCreate() {
        if (!file) {
            return toast.error("Por favor, selecione um arquivo.");
        }
        const formData = new FormData()
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('path', 'uploads');
        const actionPromise = apiAction<DocumentSchema, any>({
            method: 'post',
            url: '/documents',
            data: formData,
            successMessage: 'Documento criado com sucesso!',
            tags: [RESOURCES.DOCUMENTS]
        });
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