import { create } from "zustand";

export const useSTTStore = create((set, get) => ({
  sttData: [], // STT 결과 저장
  resultRefs: [], // STT result refs 저장

  // STT 데이터를 설정하는 함수
  setSttData: (data) => set({ sttData: data }),

  setResultRefs: (refs) => set({ resultRefs: refs }),

  // STT 시작 시간으로 해당 인덱스를 찾는 함수
  findSTTIndex: (time) => {
    const sttData = get().sttData;
    if (!sttData || sttData.length === 0) return null;

    for (let i = 0; i < sttData.length; i++) {
      const sttSegment = sttData[i];
      const startTime = parseFloat(sttSegment.start);
      const endTime = parseFloat(sttSegment.end);

      if (time >= startTime && time <= endTime) {
        return i;
      }
    }
    return null;
  },

  // 스크롤하는 함수
  scrollToSTT: (index) => {
    const refs = get().resultRefs;
    if (refs[index]) {
      refs[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  },
}));
