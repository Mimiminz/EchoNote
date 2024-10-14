import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import * as St from "@components/styles/DrawingEditor.style";
import canvasStore from "@stores/canvasStore";
import { useAudioStore } from "@stores/recordStore";
import { useSTTStore } from "@stores/sttStore";

const DrawingCanvas = forwardRef(
  (
    {
      strokeWidth,
      eraserWidth,
      strokeColor,
      eraseMode,
      readOnly,
      scale,
      page,
      lassoMode,
    },
    ref
  ) => {
    const containerRef = useRef();
    const overlayCanvasRef = useRef();
    const [selectionPath, setSelectionPath] = useState([]);
    const { getCanvasPath, setCanvasPath, getMinRecordingTime } =
      canvasStore.getState();
    const { recordTime, setStartTime } = useAudioStore();
    const [drawingTime, setDrawingTime] = useState(0);
    const { findSTTIndex, scrollToSTT } = useSTTStore();

    const loadCanvasPath = () => {
      const savedPaths = getCanvasPath(page);

      if (!ref.current) return;

      ref.current.clearCanvas();
      if (savedPaths && savedPaths.length > 0) {
        const scaledPaths = savedPaths.map((path) => ({
          ...path,
          strokeWidth: path.strokeWidth * scale,
          paths: path.paths.map((point) => ({
            x: point.x * scale,
            y: point.y * scale,
          })),
        }));

        ref.current.loadPaths(scaledPaths);
      }
    };

    useEffect(() => {
      loadCanvasPath();
      ref.current.eraseMode(eraseMode);

      if (overlayCanvasRef.current) {
        const overlayCanvas = overlayCanvasRef.current;
        const container = containerRef.current;
        const devicePixelRatio = window.devicePixelRatio || 1;

        overlayCanvas.width = container.clientWidth * devicePixelRatio;
        overlayCanvas.height = container.clientHeight * devicePixelRatio;
        overlayCanvas.style.width = `${container.clientWidth}px`;
        overlayCanvas.style.height = `${container.clientHeight}px`;

        const context = overlayCanvas.getContext("2d");
        context.scale(devicePixelRatio, devicePixelRatio);
      }
    }, [eraseMode, scale, page]);

    // lassoMode가 변경될 때마다 overlayCanvas를 초기화하거나 지우는 효과 추가
    useEffect(() => {
      if (overlayCanvasRef.current) {
        const overlayCanvas = overlayCanvasRef.current;
        const context = overlayCanvas.getContext("2d");

        context.globalAlpha = 0.2; // 배경의 투명도 설정
        context.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        context.globalAlpha = 1.0; // 경로는 기본 불투명도로 설정
        context.setLineDash([10, 10]); // 점선 설정
        context.strokeStyle = "#ffffff"; // 점선 색상
        context.lineWidth = 4;

        if (!lassoMode) {
          // lassoMode가 해제되면 캔버스를 초기화
          context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
      }
    }, [lassoMode]);

    const getRelativePosition = useCallback(
      (e) => {
        if (containerRef.current) {
          const clientX = e.changedTouches[0].clientX;
          const clientY = e.changedTouches[0].clientY;

          const containerRect = containerRef.current.getBoundingClientRect();

          const x = (clientX - containerRect.left) / scale;
          const y = (clientY - containerRect.top) / scale;

          return { x, y };
        }
        return { x: 0, y: 0 };
      },
      [scale]
    );

    const drawLassoPath = (path) => {
      const overlayCanvas = overlayCanvasRef.current;
      if (!overlayCanvas) return;

      const context = overlayCanvas.getContext("2d");
      context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

      context.globalAlpha = 0.2; // 배경의 투명도 설정
      context.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

      context.globalAlpha = 1.0; // 경로는 기본 불투명도로 설정
      context.setLineDash([10, 10]); // 점선 설정
      context.strokeStyle = "#ffffff"; // 점선 색상
      context.lineWidth = 4;

      if (path.length > 0) {
        context.beginPath();
        context.moveTo(path[0].x * scale, path[0].y * scale);
        for (let i = 1; i < path.length; i++) {
          context.lineTo(path[i].x * scale, path[i].y * scale);
        }
        context.stroke();
      }
    };

    const handleTouchStart = (event) => {
      if (lassoMode) {
        const pos = getRelativePosition(event);
        setSelectionPath([pos]);
      } else {
        setDrawingTime(recordTime ?? 0);
      }
    };

    const handleTouchMove = (event) => {
      if (lassoMode && selectionPath.length > 0) {
        const pos = getRelativePosition(event);
        setSelectionPath((prevPath) => {
          const newPath = [...prevPath, pos];
          drawLassoPath(newPath);
          return newPath;
        });
      }
    };

    const handleTouchEnd = (event) => {
      if (lassoMode && selectionPath.length > 0) {
        checkIntersections(selectionPath);
        setSelectionPath([]);
        drawLassoPath([]);
        loadCanvasPath();
      } else {
        saveCanvasPath();
        setDrawingTime(0);
      }
    };

    const pointInPolygon = (point, polygon) => {
      let isInside = false;
      const { x, y } = point;

      const closedPolygon = [...polygon, polygon[0]];

      for (
        let i = 0, j = closedPolygon.length - 1;
        i < closedPolygon.length;
        j = i++
      ) {
        const xi = closedPolygon[i].x,
          yi = closedPolygon[i].y;
        const xj = closedPolygon[j].x,
          yj = closedPolygon[j].y;

        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

        if (intersect) isInside = !isInside;
      }

      return isInside;
    };

    const checkIntersections = (polygon) => {
      const savedPaths = getCanvasPath(page);

      if (savedPaths && savedPaths.length > 0) {
        const selectedIndices = savedPaths
          .map((stroke, index) => {
            if (stroke.paths.some((point) => pointInPolygon(point, polygon))) {
              return index;
            }
            return null;
          })
          .filter((index) => index !== null);

        if (selectedIndices && selectedIndices.length > 0) {
          const minTime = getMinRecordingTime(page, selectedIndices);

          // 녹음과 매핑된 경우에만 이동
          if (minTime !== 0) {
            setStartTime(minTime);

            // 해당 minTime이 포함된 STT 인덱스 찾기
            const sttIndex = findSTTIndex(minTime);
            if (sttIndex !== null) {
              scrollToSTT(sttIndex);
            }
          }
        }
      }
    };

    const saveCanvasPath = () => {
      if (ref.current) {
        ref.current
          .exportPaths()
          .then((data) => {
            if (data.length === 0) {
              return;
            }

            const unscaledPaths = data.map((path) => ({
              ...path,
              strokeWidth: path.strokeWidth / scale,
              paths: path.paths.map((point) => ({
                x: point.x / scale,
                y: point.y / scale,
              })),
            }));

            setCanvasPath(page, unscaledPaths, drawingTime);
          })
          .catch((e) => {
            console.log("Error exporting paths:", e);
          });
      }
    };

    return (
      <St.DrawingCanvasContainer
        ref={containerRef}
        style={{ position: "relative" }}
      >
        <canvas
          ref={overlayCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: readOnly ? "none" : "auto",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={lassoMode ? handleTouchMove : null}
          onTouchEnd={handleTouchEnd}
        >
          <ReactSketchCanvas
            ref={ref}
            strokeColor={lassoMode ? "#0000000" : strokeColor || "#000"}
            strokeWidth={strokeWidth || 5}
            eraserWidth={eraserWidth || 5}
            width="100%"
            height="100%"
            canvasColor="transparent"
            readOnly={readOnly}
            style={{
              border: 0,
              borderRadius: 0,
            }}
          />
        </div>
      </St.DrawingCanvasContainer>
    );
  }
);

export default DrawingCanvas;
