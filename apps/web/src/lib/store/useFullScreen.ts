import { create } from "zustand";

interface FullScreenState {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
}

export const useFullscreenStore = create<FullScreenState>((set) => ({
  isFullscreen: false,
  setFullscreen: (value) => set({ isFullscreen: value }),
  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen();
      set({ isFullscreen: false });
    }
  },
}));