import React, { useEffect, useRef, useState } from "react";
import * as St from "@components/styles/DrawingEditor.style";
import DrawingToolBar from "@components/DrawingToolBar";
import DrawingCanvas from "@components/DrawingCanvas";
import canvasStore from "@stores/canvasStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

const DrawingEditor = ({ scale, page, readOnly }) => {
  const canvasRef = useRef();
  const [eraseMode, setEraseMode] = useState(false);
  // const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(10);
  // const [strokeColor, setStrokeColor] = useState("#000000");
  const [noEdit, setNoEdit] = useState(false);
  const { mode } = drawingTypeStore();
  const [lassoMode, setLassoMode] = useState(false);
  const [isPenActive, setIsPenActive] = useState(true);
  const [isEraserActive, setIsEraserActive] = useState(false);

  const {
    undo,
    redo,
    clearCanvasPath,
    getCanvasPath,
    activeTool,
    setActiveTool,
    strokeWidth,
    setStrokeWidth,
    // strokeColor,
    // setStrokeColor,
  } = canvasStore();

  const toggleLassoMode = () => {
    setLassoMode((prevMode) => {
      if (!prevMode) {
        // 갈고리 모드가 켜질 때, 펜과 지우개 모드를 저장하고 비활성화
        setIsPenActive(!eraseMode); // 펜 모드가 활성화된 상태면 true
        setIsEraserActive(eraseMode); // 지우개 모드가 활성화된 상태면 true
        setEraseMode(false);
      } else {
        // 갈고리 모드가 꺼질 때, 이전 펜/지우개 상태로 복원
        if (isEraserActive) {
          setEraseMode(true);
        } else if (isPenActive) {
          setEraseMode(false);
        }
      }
      return !prevMode;
    });
  };

  const handleEraserClick = () => {
    setEraseMode(true);
    setLassoMode(false);
    setActiveTool("eraser");
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    setLassoMode(false);
    setActiveTool("pen");
    canvasRef.current?.eraseMode(false);
  };

  useEffect(() => {
    if (activeTool === "pen") {
      handlePenClick();
    } else if (activeTool === "eraser") {
      handleEraserClick();
    } else if (activeTool === "lasso") {
      setEraseMode(false);
      setLassoMode(true);
      canvasRef.current?.eraseMode(false);
    }
  }, [activeTool, setActiveTool]);

  const handleStrokeWidthChange = (event) => {
    setStrokeWidth(+event.target.value);
  };

  const handleEraserWidthChange = (event) => {
    setEraserWidth(+event.target.value);
  };

  // const handleStrokeColorChange = (color) => {
  //   setStrokeColor(color);
  // };

  const loadCanvasPaths = () => {
    const savedPaths = getCanvasPath(page);
    canvasRef.current.clearCanvas();
    if (canvasRef.current && savedPaths) {
      const scaledPaths = savedPaths.map((path) => ({
        ...path,
        strokeWidth: path.strokeWidth * scale,
        paths: path.paths.map((point) => ({
          x: point.x * scale,
          y: point.y * scale,
        })),
      }));

      canvasRef.current.loadPaths(scaledPaths);
    }
  };

  const handleUndoClick = () => {
    undo(page);
    loadCanvasPaths();
  };

  const handleRedoClick = () => {
    redo(page);
    loadCanvasPaths();
  };

  const handleClearClick = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
    clearCanvasPath(page);
  };

  const handleNoEditChange = (isNoEdit) => {
    setNoEdit(isNoEdit);
  };

  useEffect(() => {
    loadCanvasPaths();
  }, [page, scale]);

  return (
    <St.DrawingEditorContainer mode={mode.pen}>
      {mode.pen && (
        <DrawingToolBar
          eraseMode={eraseMode}
          eraserWidth={eraserWidth}
          // strokeColor={strokeColor}
          onPenClick={handlePenClick}
          onEraserClick={handleEraserClick}
          onStrokeWidthChange={handleStrokeWidthChange}
          onEraserWidthChange={handleEraserWidthChange}
          // onStrokeColorChange={handleStrokeColorChange}
          onUndoChange={handleUndoClick}
          onRedoChange={handleRedoClick}
          onClearChange={handleClearClick}
          onNoEditChange={handleNoEditChange}
          onLassoClick={toggleLassoMode}
          lassoMode={lassoMode}
        />
      )}

      <DrawingCanvas
        ref={canvasRef}
        strokeWidth={strokeWidth * scale}
        eraserWidth={eraserWidth * scale}
        eraseMode={eraseMode}
        readOnly={readOnly || noEdit}
        scale={scale}
        page={page}
        lassoMode={lassoMode}
      />
    </St.DrawingEditorContainer>
  );
};

export default DrawingEditor;
