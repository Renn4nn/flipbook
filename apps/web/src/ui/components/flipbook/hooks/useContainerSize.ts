'use client'

import { useState, useEffect, useCallback, type RefObject } from 'react'

interface Size {
  width: number
  height: number
}

export function useContainerSize<T extends HTMLElement>(
  ref: RefObject<T | null>,
  maxWidth: number = 500,
  maxHeight: number = 700
): Size {
  const [size, setSize] = useState<Size>({ width: maxWidth, height: maxHeight })

  const calculateSize = useCallback(() => {
    if (!ref.current) return

    const container = ref.current.parentElement
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const padding = 40 // padding total (20px cada lado)
    const toolbarOffset = 80 // espaço para toolbar
    const sliderOffset = 100 // espaço para slider

    // Calcular espaço disponível considerando toolbar e slider
    const availableWidth = containerRect.width - padding
    const availableHeight = containerRect.height - padding - toolbarOffset - sliderOffset

    // Calcular dimensões mantendo aspect ratio
    const aspectRatio = maxHeight / maxWidth

    let newWidth = maxWidth
    let newHeight = maxHeight

    // Se a largura disponível for menor que a largura máxima
    if (availableWidth < maxWidth) {
      newWidth = availableWidth
      newHeight = newWidth * aspectRatio
    }

    // Se a altura calculada for maior que a altura disponível
    if (newHeight > availableHeight) {
      newHeight = availableHeight
      newWidth = newHeight / aspectRatio
    }

    // Limite mínimo de largura
    const minWidth = 200

    if (newWidth < minWidth) {
      newWidth = minWidth
      newHeight = newWidth * aspectRatio
    }

    setSize({ width: Math.floor(newWidth), height: Math.floor(newHeight) })
  }, [ref, maxWidth, maxHeight])

  useEffect(() => {
    if (!ref.current) return

    // Calcular tamanho inicial
    calculateSize()

    // Usar ResizeObserver para detectar mudanças no container
    const resizeObserver = new ResizeObserver(() => {
      calculateSize()
    })

    const container = ref.current.parentElement
    if (container) {
      resizeObserver.observe(container)
    }

    // Fallback para window resize
    const handleWindowResize = () => {
      calculateSize()
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [ref, calculateSize])

  return size
}
