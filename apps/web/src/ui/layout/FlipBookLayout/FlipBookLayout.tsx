"use client";

import type { ApiResponse, DocumentResponseSchema } from "@repo/schemas";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useApiResponse from "@/lib/api/hooks";
import { useFlipbookStore } from "@/lib/store/useFlipbook";
import type { FlipBookType } from "@/ui/components/flipbook/type";
import Slider from "@/ui/components/slider/Slider";
import styles from "./flipbook-layout.module.css";
import { Maximize, Expand, ZoomIn, ZoomOut } from "lucide-react";
import { useFullscreenStore } from "@/lib/store/useFullScreen";
import PageLoadingSkeleton from "@/ui/components/skeletons/workspace/PageLoadingSkeleton/PageLoadingSkeleton";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
type DocumentProps = {
  documentPromise: Promise<ApiResponse<DocumentResponseSchema>>;
};

const FlipBook = dynamic(() => import("@/ui/components/flipbook"), {
  ssr: false,
  loading: () => (
    <PageLoadingSkeleton />
  ),
});
export default function FlipBookLayout({ documentPromise }: DocumentProps) {
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
      </div>
      <div className={styles.zoomScrollArea}>
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={4}
          centerOnInit
          centerZoomedOut
          limitToBounds={true}
          doubleClick={{ disabled: true }}
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <div className={styles.fullscreenWrapper}>
                <button onClick={toggleFullscreen} className={styles.fullscreenButton}>
                  {isFullscreen ? <Expand size={22} /> : <Maximize size={22} />}
                </button>

                <button onClick={() => zoomIn(0.4, 300, "easeOut")} className={styles.fullscreenButton}>
                  <ZoomIn size={22} />
                </button>

                <button onClick={() => zoomOut(0.4, 300, "easeOut")} className={styles.fullscreenButton}>
                  <ZoomOut size={22} />
                </button>
              </div>
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className={styles.zoomScalingWrapper}>
                  <FlipBook
                    type={type}
                    file={`http://localhost:3001${data?.path}`}
                    width={500}
                    height={665}
                  />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
      <div className={styles.sliderContainer}>
        <Slider />
      </div>
    </div>
  );
}
