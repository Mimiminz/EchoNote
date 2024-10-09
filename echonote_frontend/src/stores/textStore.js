import { create } from "zustand";

const textStore = create((set, get) => ({
  textItems: {}, // 페이지별로 textItems를 관리하기 위해 객체로 변경
  currentPage: 1, // 현재 페이지 상태 추가
  isTextMode: false,
  fontProperty: {
    fontSize: 10,
  },
  selectedText: { id: null },

  setFontSize: (newFontSize) => {
    set((state) => ({
      fontProperty: {
        ...state.fontProperty,
        fontSize: newFontSize, // fontSize만 업데이트
      },
    }));
  },

  loadTextItems: (item) => {
    set((state) => ({
      textItems: item,
    }));
  },

  addTextItem: (item) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: [...(state.textItems[currentPage] || []), item],
      },
    }));
  },

  updateTextItem: (id, newText) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.id === id
            ? { ...item, detail: { ...item.detail, text: newText } }
            : item
        ),
      },
    }));
  },

  finishEditing: (id) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].filter((item) => {
          if (item.id === id) {
            if (item.detail.text.trim() === "") return false;
            item.detail.isEditing = false;
          }
          return true;
        }),
      },
    }));
  },

  setIsTextMode: (isTextMode) => set(() => ({ isTextMode })),

  updateTextItemPosition: (id, x, y) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.id === id ? { ...item, detail: { ...item.detail, x, y } } : item
        ),
      },
    }));
  },

  setIsDragging: (id, isDragging, offsetX = 0, offsetY = 0) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.id === id
            ? {
                ...item,
                detail: { ...item.detail, isDragging, offsetX, offsetY },
              }
            : item
        ),
      },
    }));
  },

  dragTextItem: (id, newX, newY) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.id === id
            ? { ...item, detail: { ...item.detail, x: newX, y: newY } }
            : item
        ),
      },
    }));
  },

  resetDraggingState: () => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].map((item) =>
          item.detail.isDragging
            ? { ...item, detail: { ...item.detail, isDragging: false } }
            : item
        ),
      },
    }));
  },

  deleteTextItem: (id) => {
    const currentPage = get().currentPage;
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: state.textItems[currentPage].filter(
          (item) => item.id !== id
        ),
      },
    }));
  },

  resetTextItems: () => set(() => ({ textItems: {} })),

  getTextItemById: (id) => {
    const currentPage = get().currentPage;
    return get().textItems[currentPage]?.find((item) => item.id === id);
  },

  getCurrentPageItems: () => {
    const currentPage = get().currentPage;
    return get().textItems[currentPage] || [];
  },

  setCurrentPageForText: (page) => set(() => ({ currentPage: page })),

  setSelectedText: (id) => {
    set((state) => ({
      selectedText: { id }, // 선택된 텍스트 상태 업데이트
    }));
  },

  editTextItem: () => {
    const { selectedText, currentPage, textItems } = get();
    const items = textItems[currentPage] || [];
    set((state) => ({
      textItems: {
        ...state.textItems,
        [currentPage]: items.map((item) =>
          item.id === selectedText.id
            ? { ...item, detail: { ...item.detail, isEditing: true } }
            : item
        ),
      },
    }));
  },

  resetTimestamps: (page) => {
    set((state) => ({
      textItems: {
        ...state.textItems,
        [page]: state.textItems[page]?.map((item) => ({
          ...item,
          detail: {
            ...item.detail,
            timestamp: null, // 타임스탬프를 null로 초기화
          },
        })),
      },
    }));
  },

  getTimestampForSelectedText: () => {
    const currentPage = get().currentPage;
    const selectedTextId = get().selectedText.id;
    const textItemsForPage = get().textItems[currentPage];

    if (!textItemsForPage || !selectedTextId) {
      return null; // 유효하지 않은 경우 null 반환
    }

    const selectedItem = textItemsForPage.find(
      (item) => item.id === selectedTextId
    );
    return selectedItem?.detail?.timestamp || null; // timestamp가 있으면 반환, 없으면 null
  },
}));

export default textStore;
