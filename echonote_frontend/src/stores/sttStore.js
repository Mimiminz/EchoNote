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
      const element = refs[index];
      const container = document.querySelector(".stt-list"); // 스크롤이 발생하는 상위 컨테이너

      if (container) {
        // 현재 요소의 위치 정보 가져오기 (상위 컨테이너 내에서)
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // 요소의 상대적인 위치 계산
        const elementY =
          container.scrollTop + elementRect.top - containerRect.top;

        // 스크롤 오프셋 조정 값 (더 많이 내리기 위해 추가)
        const offsetY = container.clientHeight / 2;

        // 중간보다 약간 더 아래로 위치시키기 위해 offsetAdjustment 추가
        container.scrollTo({
          top: elementY - offsetY,
          behavior: "smooth",
        });

        // 하이라이트 효과
        const originalColor = element.querySelector("a").style.color;
        element.querySelector("a").style.color = "red";

        // 일정 시간 후에 원래 색상으로 복구
        setTimeout(() => {
          element.querySelector("a").style.color = originalColor;
        }, 1500);
      } else {
        console.error("스크롤 컨테이너를 찾을 수 없습니다.");
      }
    }
  },
}));
