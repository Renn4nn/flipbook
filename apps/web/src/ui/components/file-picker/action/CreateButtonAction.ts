'use server'

import { apiRequest } from "@/lib/api/request"
import type { ApiActionReturn } from "@/lib/types/action"

type CreateProps = {
  file: File
  type: string
}

export async function createBookAction({ file, type }: CreateProps): Promise<ApiActionReturn<Record<string, unknown>>> {
  const res = await apiRequest({
    method: 'post',
    url: '/documents',
    data: {
      file,
      type
    }
  })

  return {
    message: 'Documento criado com sucesso',
    data: res
  }
}
