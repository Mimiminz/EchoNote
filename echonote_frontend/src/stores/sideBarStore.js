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

  isKeyword: false,
  toggleKeyword: () => set((state) => ({ isKeyword: !state.isKeyword })),

  isAnalyzed: false,
  toggleAnalyzed: () => set((state) => ({ isAnalyzed: !state.isAnalyzed })),

  sttKeyword: ["비극", "영하", "음질"],
  setSTTKeywords: (keywords) => set({ sttKeyword: keywords }),
  currentKeyword: [],
  setCurrentKeyword: (keywords) => set({ currentKeyword: keywords }),
}));

export { useSidebarStore, useSearchStore };
