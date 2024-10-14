import { create } from "zustand";

// Canvas 관련 상태 관리
const canvasStore = create((set, get) => ({
  savedCanvasPaths: {}, // 페이지별 저장된 경로 데이터
  savedCanvasRecords: {}, // 페이지별 저장된 녹음 시간
  undoStacks: {}, // 페이지별 undo 스택
  redoStacks: {}, // 페이지별 redo 스택
  strokeColor: "#000",
  activeTool: "pen",

  setStrokeColor: (color) => {
    set(() => ({
      strokeColor: color,
    }));
  },

  setActiveTool: (tool) => {
    set(() => ({
      activeTool: tool,
    }));
  },

  resetStrockColor: () => {
    set(() => ({
      strokeColor: "#000",
    }));
  },

  // 경로 데이터를 저장하는 함수
  setCanvasPath: (page, data, time) => {
    set((state) => {
      const newUndoStack = [...(state.undoStacks[page] || []), data];
      const newRecords = [...(state.savedCanvasRecords[page] || []), time];
      return {
        savedCanvasPaths: { ...state.savedCanvasPaths, [page]: data },
        savedCanvasRecords: { ...state.savedCanvasRecords, [page]: newRecords },
        undoStacks: { ...state.undoStacks, [page]: newUndoStack },
        redoStacks: { ...state.redoStacks, [page]: [] }, // 새로운 경로가 추가되면 redo 스택 초기화
      };
    });
  },

  // 저장된 경로 데이터를 불러오는 함수
  getCanvasPath: (page) => {
    return get().savedCanvasPaths?.[page] || [];
  },

  // 저장된 녹음 시간을 불러오는 함수
  getCanvasRecords: (page) => {
    return get().savedCanvasRecords?.[page] || [];
  },

  // 선택된 시간 중 가장 빠른 값을 반환하는 함수
  getMinRecordingTime: (page, indices) => {
    const records = get().getCanvasRecords(page);
    if (records.length === 0) return null;

    // 인덱스에 해당하는 녹음 시간 중 가장 작은 값을 찾음
    const times = indices.map((index) => records[index]);
    return Math.min(...times);
  },

  undo: (page) => {
    set((state) => {
      const { undoStacks, redoStacks, savedCanvasPaths } = state;
      const pageUndoStack = undoStacks[page] || [];

      if (pageUndoStack.length > 0) {
        const newRedoStack = [
          ...(redoStacks[page] || []),
          savedCanvasPaths[page],
        ];
        const newUndoStack = pageUndoStack.slice(0, -1);
        const previousPath =
          newUndoStack.length > 0
            ? newUndoStack[newUndoStack.length - 1]
            : null;

        return {
          savedCanvasPaths: { ...savedCanvasPaths, [page]: previousPath },
          undoStacks: { ...undoStacks, [page]: newUndoStack },
          redoStacks: { ...redoStacks, [page]: newRedoStack },
        };
      }
      return state;
    });
  },

  redo: (page) => {
    set((state) => {
      const { undoStacks, redoStacks, savedCanvasPaths } = state;
      const pageRedoStack = redoStacks[page] || [];

      if (pageRedoStack.length > 0) {
        const nextPath = pageRedoStack[pageRedoStack.length - 1];
        const newUndoStack = [...(undoStacks[page] || []), nextPath];
        const newRedoStack = pageRedoStack.slice(0, -1);

        return {
          savedCanvasPaths: { ...savedCanvasPaths, [page]: nextPath },
          undoStacks: { ...undoStacks, [page]: newUndoStack },
          redoStacks: { ...redoStacks, [page]: newRedoStack },
        };
      }
      return state;
    });
  },

  // 경로 데이터를 초기화하는 함수
  clearCanvasPath: (page) => {
    const currentPath = get().savedCanvasPaths[page];
    set((state) => ({
      savedCanvasPaths: { ...state.savedCanvasPaths, [page]: null },
      undoStacks: {
        ...state.undoStacks,
        [page]: [...(state.undoStacks[page] || []), currentPath],
      },
      redoStacks: { ...state.redoStacks, [page]: [] },
    }));
  },

  // api 요청 보낼 구조로 변경
  drawings: () => {
    const paths = get().savedCanvasPaths;
    const records = get().savedCanvasRecords;
    const result = {};

    if (paths) {
      Object.keys(paths).forEach((page) => {
        if (paths[page]) {
          result[page] = paths[page].map((path, index) => ({
            id: index,
            detail: {
              paths: path,
              timestamp: records[page] ? records[page][index] : null,
            },
          }));
        }
      });
    }

    return result;
  },

  loadDrawings: (data) => {
    const newCanvasPaths = {};
    const newCanvasRecords = {};

    if (data) {
      Object.keys(data).forEach((page) => {
        if (data[page]) {
          newCanvasPaths[page] = data[page].map((item) => item.detail.paths);
          newCanvasRecords[page] = data[page].map(
            (item) => item.detail.timestamp
          );
        }
      });
    }

    set(() => ({
      savedCanvasPaths: newCanvasPaths,
      savedCanvasRecords: newCanvasRecords,
    }));
  },

  resetAllTimestamps: () => {
    const { savedCanvasRecords } = get();
    const newRecords = {};

    Object.keys(savedCanvasRecords).forEach((page) => {
      newRecords[page] = savedCanvasRecords[page].map(() => 0);
    });

    set(() => ({
      savedCanvasRecords: newRecords,
    }));
  },

  resetAllDrawings: () => {
    set(() => ({
      savedCanvasPaths: null,
      savedCanvasRecords: null,
      activeTool: "pen",
    }));
  },
}));

export default canvasStore;
