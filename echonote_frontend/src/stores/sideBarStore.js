import { create } from "zustand";

const useSidebarStore = create((set) => ({
  isPdfBarOpened: false,
  isSTTBarOpened: false,
  isRecordingBarOpened: false,

  togglePdfBar: () =>
    set((state) => ({ isPdfBarOpened: !state.isPdfBarOpened })),

  toggleSTTBar: () =>
    set((state) => ({ isSTTBarOpened: !state.isSTTBarOpened })),

  toggleRecordingBar: () =>
    set((state) => ({ isRecordingBarOpened: !state.isRecordingBarOpened })),

  resetSidebarStore: () =>
    set({
      isPdfBarOpened: false,
      isSTTBarOpened: false,
      isRecordingBarOpened: false,
    }),
}));

const useSearchStore = create((set) => ({
  currentIndex: 0,
  setCurrentIndex: (index) => set({ currentIndex: index }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),

  isKeyword: true,
  toggleKeyword: () => set((state) => ({ isKeyword: !state.isKeyword })),

  isAnalyzed: true,
  toggleAnalyzed: () => set((state) => ({ isAnalyzed: !state.isAnalyzed })),

  keywordColor: "#B80000",
  setKeywordColor: (color) => set({ keywordColor: color }),

  currentKeyword: [],
  setCurrentKeyword: (keywords) => set({ currentKeyword: keywords }),
}));

export { useSidebarStore, useSearchStore };
