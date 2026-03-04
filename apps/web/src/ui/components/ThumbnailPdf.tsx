'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
export default function ThumbnailPdf({url}: {url: string}){
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  
    useEffect(() => {
    async function generate() {
      // REFATORAR ISSO AQUI
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString()
        const loadingTask = pdfjs.getDocument(url)
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 0.6 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        canvas.height = viewport.height
        canvas.width = viewport.width

        if (context) {
          await page.render({ 
            canvasContext: context, 
            viewport: viewport,
            canvas: canvas
          }).promise
          setThumbnail(canvas.toDataURL('image/jpeg'))
        }
      } catch (err) {
        console.error("Erro na capa:", err)
      }
    }
    generate()
  }, [url])

    if (!thumbnail) return <div style={{ height: '350px', background: '#222', borderRadius: '8px' }} />
  
  return (
    <>
        <img 
      src={thumbnail} 
      style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} 
    />
    </>
  )
}