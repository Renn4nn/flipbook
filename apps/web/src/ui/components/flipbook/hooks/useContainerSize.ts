'use client'

import { type RefObject, useCallback, useEffect, useState } from 'react'

interface Size {
	width: number
	height: number
}

export function useContainerSize<T extends HTMLElement>(
	ref: RefObject<T | null>,
	maxWidth: number = 580,
	maxHeight: number = 820,
	pageAspectRatio: number = maxWidth / maxHeight
): Size {
	const [size, setSize] = useState<Size>({ width: maxWidth, height: maxHeight })

	const calculateSize = useCallback(() => {
		if (!ref.current) return

		const container = ref.current.parentElement
		if (!container) return

		const containerRect = container.getBoundingClientRect()
		const padding = 24
		const toolbarOffset = 72
		const navigationOffset = 120

		// O slider já ocupa outra linha no grid. Aqui reservamos apenas a toolbar
		// e a navegação lateral para manter as duas páginas abertas na tela.
		const availableWidth = Math.min(
			containerRect.width - padding,
			(containerRect.width - navigationOffset) / 2
		)
		const availableHeight = containerRect.height - padding - toolbarOffset

		// Calcular dimensões mantendo aspect ratio
		let newWidth = maxWidth
		let newHeight = newWidth / pageAspectRatio

		if (newHeight > maxHeight) {
			newHeight = maxHeight
			newWidth = newHeight * pageAspectRatio
		}

		// Se a largura disponível for menor que a largura máxima
		if (availableWidth < maxWidth) {
			newWidth = availableWidth
			newHeight = newWidth / pageAspectRatio
		}

		// Se a altura calculada for maior que a altura disponível
		if (newHeight > availableHeight) {
			newHeight = availableHeight
			newWidth = newHeight * pageAspectRatio
		}

		// Limite mínimo de largura
		const minWidth = 200

		if (newWidth < minWidth) {
			newWidth = minWidth
			newHeight = newWidth / pageAspectRatio
		}

		setSize({ width: Math.floor(newWidth), height: Math.floor(newHeight) })
	}, [ref, maxWidth, maxHeight, pageAspectRatio])

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
