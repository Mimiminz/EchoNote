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
}));

export default useSidebarStore;
