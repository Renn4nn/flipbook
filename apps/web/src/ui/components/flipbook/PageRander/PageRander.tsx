import { useState } from "react";
import { Page } from "react-pdf";
import { PageSkeleton } from "../../skeletons/workspace/PageSkeleton/PageSkeleton";

export const PageRander = ({ pageNumber, width, height }: { pageNumber: number, width: number, height: number }) => {
  const [isRendered, setIsRendered] = useState(false);

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
        <Page
          width={width}
          height={height}
          pageNumber={pageNumber}
          devicePixelRatio={Math.min(window.devicePixelRatio, 2)}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          loading=""
          onRenderSuccess={() => setIsRendered(true)}
        />
      </div>
    </div>
  );
};