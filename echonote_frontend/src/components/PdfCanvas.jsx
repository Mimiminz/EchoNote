import React, { useState, useEffect, useRef, useCallback } from "react";
import * as St from "./styles/PdfCanvas.style";
import * as pdfjsLib from "pdfjs-dist";
import PdfEditor from "@components/PdfEditor";
import pageStore from "@/stores/pageStore"; // zustand의 상태와 액션 가져오기
import DrawingEditor from "@components/DrawingEditor";
import drawingTypeStore from "@/stores/drawingTypeStore";
import { useNoteStore } from "@stores/noteStore";
import LoadingIcon from "@components/common/LoadingIcon"; // 로딩 아이콘
import { useAudioStore } from "@/stores/recordStore";

const PdfCanvas = ({ containerRef, isDrawingEditorOpened, onResize }) => {
  const canvasRef = useRef();
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const [pdfRef, setPdfRef] = useState(null);
  const { currentPage, setPages, scale, url, setOriginSize } = pageStore(); // zustand의 상태와 액션 가져오기
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const renderTaskRef = useRef(null);
  const [isRendering, setIsRendering] = useState(true); // 렌더링 상태 추가
  const { mode, resetType } = drawingTypeStore();
  const { pdf_path, addPageMovements } = useNoteStore();
  const { recordTime } = useAudioStore();

  // const pdf_path =
  //   "https://timeisnullnull.s3.ap-northeast-2.amazonaws.com/le_Petit_Prince_%EB%B3%B8%EB%AC%B8.pdf";

  const renderPage = useCallback(
    (pageNum, pdf = pdfRef) => {
      if (pdf && containerRef.current && canvasRef.current) {
        setIsRendering(true); // 렌더링 시작 시 true로 설정
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

          if (canvas) {
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
                setIsRendering(false); // 렌더링 완료 후 false로 설정
                renderTaskRef.current = null;
              })
              .catch((err) => {
                setIsRendering(false); // 오류 발생 시에도 false로 설정
                if (err.name !== "RenderingCancelledException") {
                  console.error(err);
                }
              });
          }
        });
      }
    },
    [pdfRef, scale, containerRef]
  );

  useEffect(() => {
    if (recordTime !== null)
      addPageMovements({ timestamp: recordTime, page: currentPage });
  }, [currentPage]);

  // currentPage, scale이 바뀔 때마다 페이지 렌더링
  useEffect(() => {
    if (pdfRef) {
      renderPage(currentPage, pdfRef);
    }
  }, [currentPage, pdfRef, scale, renderPage]);

  // PDF 로드 후 페이지 설정
  useEffect(() => {
    if (pdfRef) setPages(pdfRef.numPages);
  }, [pdfRef, setPages]);

  // PDF 문서를 로드
  useEffect(() => {
    if (pdf_path) {
      resetType();
      setIsRendering(true);
      const loadingTask = pdfjsLib.getDocument(pdf_path);
      loadingTask.promise.then(
        (loadedPdf) => {
          setPdfRef(loadedPdf);
        },
        (err) => {
          setIsRendering(false);
          if (err.name === "InvalidPDFException") {
            console.error("유효하지 않은 PDF 파일입니다:" + pdf_path);
            alert("유효하지 않은 PDF 파일입니다. 다른 파일을 시도해 주세요.");
          } else {
            console.error("PDF 로드 중 오류 발생:", err);
          }
        }
      );
    }
  }, [pdf_path]);

  useEffect(() => {
    onResize(canvasSize.width, canvasSize.height);
  }, [canvasSize]);

  useEffect(() => {
    setOriginSize(originalSize.width, originalSize.height);
  }, [originalSize]);

  return (
    <St.PdfCanvasContainer width={canvasSize.width} height={canvasSize.height}>
      <div style={{ margin: "10px" }}>
        {/* canvas는 항상 DOM에 렌더링되며, isRendering에 따라 로딩 아이콘을 표시 */}
        <canvas ref={canvasRef}></canvas>
        {isRendering ? (
          <LoadingIcon /> // 로딩 중일 때 로딩 아이콘 표시
        ) : (
          <>
            <PdfEditor
              scale={scale}
              originalSize={originalSize}
              currentPage={currentPage}
              containerRef={containerRef}
            />
            {mode.pen ? (
              <DrawingEditor
                scale={scale}
                page={currentPage}
                readOnly={false}
              />
            ) : (
              <DrawingEditor scale={scale} page={currentPage} readOnly={true} />
            )}
          </>
        )}
      </div>
    </St.PdfCanvasContainer>
  );
};

export default PdfCanvas;
