'use client'

import { useCallback, useEffect, useRef } from 'react'

export function useFlipbookAudio(soundPath: string = '/sounds/page_flip.MP3') {
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		if (typeof window === 'undefined') return

		audioRef.current = new Audio(soundPath)
		audioRef.current.playbackRate = 2.5
		audioRef.current.volume = 1
	}, [soundPath])

	const play = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.currentTime = 0
			audioRef.current.play().catch(() => {})
		}
	}, [])

	return { play }
}
