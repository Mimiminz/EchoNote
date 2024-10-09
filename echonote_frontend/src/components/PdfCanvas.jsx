import React, { useState, useEffect, useRef, useCallback } from "react";
import * as St from "./styles/PdfCanvas.style";
import * as pdfjsLib from "pdfjs-dist";
import PdfEditor from "@components/PdfEditor";
import pageStore from "@/stores/pageStore"; // zustand 스토어 가져오기
import DrawingEditor from "@components/DrawingEditor";
import { DrawingEditorContainer } from "@components/styles/DrawingEditor.style";
import canvasStore from "@stores/canvasStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import { useNoteStore } from "@stores/noteStore";

const PdfCanvas = ({ url, containerRef, isDrawingEditorOpened, onResize }) => {
  const canvasRef = useRef();
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const [pdfRef, setPdfRef] = useState(null);
  const { currentPage, setPages, scale } = pageStore(); // zustand의 상태와 액션 가져오기
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const renderTaskRef = useRef(null);
  const { mode } = drawingTypeStore();
  // const { note_id, pdf_path } = useNoteStore();

  const pdf_path =
    "https://timeisnullnull.s3.ap-northeast-2.amazonaws.com/le_Petit_Prince_%EB%B3%B8%EB%AC%B8.pdf";

  const renderPage = useCallback(
    (pageNum, pdf = pdfRef) => {
      if (pdf && containerRef.current) {
        pdf.getPage(pageNum).then((page) => {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;

          const viewport = page.getViewport({ scale: 1 });
          const widthScale = (containerWidth / viewport.width) * 0.9;
          const heightScale = (containerHeight / viewport.height) * 0.9;
          const scaleFactor = Math.min(widthScale, heightScale);

          const scaledViewport = page.getViewport({
            scale: scaleFactor * scale,
          });

          const canvas = canvasRef.current;
          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;

          setCanvasSize({
            width: scaledViewport.width,
            height: scaledViewport.height,
          });

          setOriginalSize({
            width: scaledViewport.width / scale,
            height: scaledViewport.height / scale,
          });

          const renderContext = {
            canvasContext: canvas.getContext("2d"),
            viewport: scaledViewport,
          };

          if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
          }

          renderTaskRef.current = page.render(renderContext);

          renderTaskRef.current.promise
            .then(() => {
              renderTaskRef.current = null;
            })
            .catch((err) => {
              if (err.name !== "RenderingCancelledException") {
                console.error(err);
              }
            });
        });
      }
    },
    [pdfRef, scale, containerRef]
  );

  // currentPage, scale이 바뀔 때마다 페이지 렌더링
  useEffect(() => {
    renderPage(currentPage, pdfRef);
  }, [currentPage, pdfRef, scale, renderPage]);

  // PDF 로드 후 페이지 설정
  useEffect(() => {
    if (pdfRef) setPages(pdfRef.numPages);
  }, [pdfRef, setPages]);

  // PDF 문서를 로드
  useEffect(() => {
    if (pdf_path) {
      const loadingTask = pdfjsLib.getDocument(pdf_path);
      loadingTask.promise.then(
        (loadedPdf) => {
          setPdfRef(loadedPdf);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }, [pdf_path]);

  useEffect(() => {
    onResize(canvasSize.width, canvasSize.height);
  }, [canvasSize]);

  return (
    <St.PdfCanvasContainer width={canvasSize.width} height={canvasSize.height}>
      <div style={{ margin: "10px" }}>
        <canvas ref={canvasRef}></canvas>
        <PdfEditor
          scale={scale}
          originalSize={originalSize}
          currentPage={currentPage}
          containerRef={containerRef}
        />
        {mode.pen ? (
          <DrawingEditor scale={scale} page={currentPage} readOnly={false} />
        ) : (
          <DrawingEditor scale={scale} page={currentPage} readOnly={true} />
        )}
      </div>
    </St.PdfCanvasContainer>
  );
};

export default PdfCanvas;
