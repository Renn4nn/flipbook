"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import type { FlipBookType } from "@/ui/components/flipbook/type";
import Slider from "@/ui/components/slider/Slider";
import styles from "./flipbook-page.module.css";
import { Button } from "@repo/ui/button";
import { useFullscreenStore } from "@/lib/store/useFullScreen";
import { Expand, Maximize } from "lucide-react";
type DocumentProps = {
  file: File;
};

const FlipBook = dynamic(() => import("@/ui/components/flipbook"), {
  ssr: false,
  loading: () => <p>Carregando leitor...</p>,
});
export default function FlipBookPage({ file }: DocumentProps) {
  const [type] = useState<FlipBookType>("magazine");
  const { isFullscreen, toggleFullscreen, setFullscreen } =
    useFullscreenStore();

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
          <Button onClick={toggleFullscreen}>
            {isFullscreen ? <Expand /> : <Maximize />}
          </Button>
        </div>
        <FlipBook type={type} file={file} width={500} height={665} />
      </div>

      <div className={styles.sliderContainer}>
        <Slider />
      </div>
    </div>
  );
}
