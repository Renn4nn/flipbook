"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Logo } from "@repo/ui/logo";
import FilePicker from "@/ui/components/file-picker/FilePicker";
import FlipBookLayoutPreview from "@/ui/layout/FlipBookLayout/FlipBookLayoutPreview";
import { useFullscreenStore } from "@/lib/store/useFullScreen";
import PageLoadingSkeleton from "@/ui/components/skeletons/workspace/PageLoadingSkeleton/PageLoadingSkeleton";

const FlipBook = dynamic(() => import("@/ui/components/flipbook"), {
  ssr: false,
  loading: () => <PageLoadingSkeleton />,
});

export default function LandingPage() {
  const [file, setFile] = useState<File | null>(null);
  const { isFullscreen, setFullscreen } =
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
    <div className={styles.landingContainer}>
      <header
        className={`${styles.header} ${isFullscreen ? styles.hidden : ""}`}
      >
        <div className={styles.headerContent}>
          <Logo />
          <div className={styles.headerText}>
            <h1>CTD Flipbook</h1>
            <p>Visualize seus documentos de forma interativa e moderna</p>
          </div>
        </div>
        {file && (
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => setFile(null)}
          >
            Remover arquivo
          </button>
        )}
      </header>

      <main className={styles.main}>
        {!file ? (
          <FilePicker file={file} setFile={setFile} />
        ) : (
          <FlipBookLayoutPreview file={file} />
        )}
      </main>

      <footer
        className={`${styles.footer} ${isFullscreen ? styles.hidden : ""}`}
      >
        <p>CTD - Companhia de Tecnologia e Desenvolvimento</p>
      </footer>
    </div>
  );
}
