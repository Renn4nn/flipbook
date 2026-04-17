import { useState, useRef, useEffect } from "react";
import { Page } from "react-pdf";
import { PageSkeleton } from "../../skeletons/workspace/PageSkeleton/PageSkeleton";
import { ErrorBoundary } from "@/ui/components/error-boundary/ErrorBoundary";

export const PageRander = ({ pageNumber, width, height }: { pageNumber: number, width: number, height: number }) => {
  const [isRendered, setIsRendered] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleRenderSuccess = () => {
    if (isMounted.current) {
      setIsRendered(true);
    }
  };

  return (
    <div style={{ position: 'relative', width, height }}>
      {!isRendered && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <PageSkeleton width={width} height={height} />
        </div>
      )}
      <div style={{
        opacity: isRendered ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        width: '100%',
        height: '100%'
      }}>
        <ErrorBoundary fallback={<PageSkeleton width={width} height={height} />}>
          <Page
            key={`page_${pageNumber}`}
            width={width}
            height={height}
            pageNumber={pageNumber}
            devicePixelRatio={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading=""
            error={<PageSkeleton width={width} height={height} />}
            onRenderSuccess={handleRenderSuccess}
            onRenderError={(err) => console.log('Renderização cancelada ou erro:', err.message)}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};