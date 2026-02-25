// função para tratar a resposta de uma promise de requisição à API

'use client'

import type { ApiResponse, DataType } from '@repo/schemas'
import { use, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function useApiResponse<T extends DataType>(
  apiResponsePromise: Promise<ApiResponse<T>>
): T | null {
  const res = use(apiResponsePromise)

  useEffect(() => {
    if ('error' in res) {
      toast.error(res.error.message)
    }
    if ('errors' in res) {
      res.errors.map((e) => toast.error(e.message))
    }
  }, [res])

  if ('data' in res) return res.data

  return null
}
