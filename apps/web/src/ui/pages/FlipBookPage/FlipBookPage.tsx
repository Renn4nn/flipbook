"use client";

import type { ApiResponse, DocumentResponseSchema } from "@repo/schemas";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useApiResponse from "@/lib/api/hooks";
import { useFlipbookStore } from "@/lib/store/useFlipbook";
import type { FlipBookType } from "@/ui/components/flipbook/type";
import Slider from "@/ui/components/slider/Slider";
import styles from "./flipbook-page.module.css";
import { Button } from "@repo/ui/button";
import { Maximize, Expand } from "lucide-react";
import { useFullscreenStore } from "@/lib/store/useFullScreen";
type DocumentProps = {
  documentPromise: Promise<ApiResponse<DocumentResponseSchema>>;
};

const FlipBook = dynamic(() => import("@/ui/components/flipbook"), {
  ssr: false,
  loading: () => (
    <div>Carregando...</div>
  ),
});
export default function FlipBookPage({ documentPromise }: DocumentProps) {
  const { reset } = useFlipbookStore();
  const [type] = useState<FlipBookType>("magazine");

  const { isFullscreen, toggleFullscreen, setFullscreen } =
    useFullscreenStore();

  useEffect(() => {
    reset();
  }, [reset]);

  const data = useApiResponse<DocumentResponseSchema>(documentPromise);

  // Fazer SKELETON
  if (!data) {
    return <div>Documento não encontrado.</div>;
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [setFullscreen]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.flipbookContainer}>
        <div className={styles.fullscreenWrapper}>
          <button 
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {isFullscreen ? <Expand size={22} /> : <Maximize size={22} />}
          </button>
        </div>
        <FlipBook
          type={type}
          // @ts-expect-error: a estrutura do ApiResponse extrai o data mas o TS não mapeou o nesting
          file={`http://localhost:3001${data?.path}`}
          width={500}
          height={665}
        />
      </div>

      <div className={styles.sliderContainer}>
        <Slider />
      </div>
    </div>
  );
}
