import { useEffect, useState, useRef, require } from "react";
import {
  STTContainer,
  STTResultList,
  STTResultItem,
  ResultLink,
  ResultText,
  Highlight,
  AnalzedHighlight,
  KeywordHighlight,
} from "@/components/styles/STT.style";
import { useAudioStore } from "@stores/recordStore";
import { getSTTResult } from "@services/sttApi";
import { useSearchStore } from "@stores/sideBarStore";
import { useNoteStore } from "@stores/noteStore";
import LoadingIcon from "@components/common/LoadingIcon";
import Swal from "sweetalert2";
import pageStore from "@/stores/pageStore";
import { useSTTStore } from "@stores/sttStore";

// 시간 포맷팅 함수 (초를 분:초로 변환)
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const STTComponent = ({ searchTerm, isEditMode, onSubmit }) => {
  // const [sttData, setSttData] = useState([]);
  const [modifiedTexts, setModifiedTexts] = useState([]);
  const { setStartTime } = useAudioStore();
  const { note_id, record_path, stt_status, setSTTStatus } = useNoteStore();
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentPage } = pageStore();
  const { sttData, setSttData, setResultRefs } = useSTTStore();

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const {
    currentIndex,
    setSearchResults,
    currentKeyword,
    searchResults,
    isKeyword,
    isAnalyzed,
    keywordColor,
    analyzedColor,
  } = useSearchStore();
  const resultRefs = useRef([]);
  const resultListRef = useRef(null);

  useEffect(() => {
    if (resultRefs.current.length > 0) {
      setResultRefs(resultRefs.current);
    }
  }, [sttData]);

  const fetchData = async () => {
    const data = await getSTTResult(note_id);
    if (data && data.result) {
      setSttData(data.result);
    }
  };

  // 컴포넌트 마운트 시 API 데이터 가져오기
  useEffect(() => {
    if (!note_id || !stt_status || !record_path) {
      return;
    }

    if (stt_status === "done") {
      fetchData();
    } else if (stt_status === "processing") {
      setIsLoading(true);
      const eventSource = new EventSource(
        `${import.meta.env.VITE_API_URL}voice/sse?note_id=${note_id}`
      ); // notd_id를 키값으로 들고다님 반드시 필요!

      console.log("SSE 연결 시도 중...");

      // STT 완료 이벤트 처리
      eventSource.addEventListener("stt_complete", (event) => {
        eventSource.close();
        Toast.fire({
          icon: "success",
          title: "STT분석이 완료되었어요",
        });

        setSTTStatus("done");
        fetchData();
      });

      // 일반 메시지 처리
      eventSource.onmessage = (event) => {
        console.log("메시지 수신: ", event.data);
      };

      // 오류 처리
      eventSource.onerror = (event) => {
        console.error("SSE 오류 발생:", event);
        console.error("readyState:", eventSource.readyState); // 상태 로그
        Toast.fire({
          icon: "error",
          title: "STT분석에 실패했어요",
        });
        eventSource.close(); // 연결 종료
      };

      // 컴포넌트 언마운트 시 SSE 연결 닫기
      return () => {
        setIsLoading(false);
        eventSource.close();
        console.log("SSE 연결 종료");
      };
    }
  }, [stt_status, note_id, record_path]);

  // 검색어를 포함한 부분 강조 및 참조 저장
  const highlightText = (text, index) => {
    if (
      !searchTerm &&
      (!isKeyword || !currentKeyword || currentKeyword.length === 0)
    ) {
      return text; // 검색어와 키워드가 없으면 원본 텍스트 반환
    }

    const searchRegex = searchTerm ? `(${searchTerm})` : null;
    const keywordRegex =
      currentKeyword.length > 0 ? `(${currentKeyword.join("|")})` : null;

    const combinedRegex = new RegExp(
      [searchRegex, keywordRegex].filter(Boolean).join("|"),
      "gi"
    );

    const parts = text.split(combinedRegex);

    return (
      <span>
        {parts.map((part, i) => {
          if (
            typeof part === "string" &&
            part.toLowerCase() === searchTerm?.toLowerCase()
          ) {
            return <Highlight key={i}>{part}</Highlight>;
          }

          if (
            isKeyword &&
            currentKeyword.some(
              (keyword) =>
                typeof part === "string" &&
                part.toLowerCase() === keyword.toLowerCase()
            )
          ) {
            return (
              <KeywordHighlight key={i} keywordColor={keywordColor}>
                {part}
              </KeywordHighlight>
            );
          }

          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  // 텍스트 수정 시 호출되는 함수
  const handleTextChange = (segmentId, newText) => {
    const segment = sttData.find((item) => item.id === segmentId);

    if (segment) {
      const modifiedSegment = {
        id: segmentId,
        start: segment.start,
        end: segment.end,
        text: newText,
        anomaly: segment.anomaly,
      };

      const exists = modifiedTexts.find((item) => item.id === segmentId);
      if (exists) {
        setModifiedTexts((prev) =>
          prev.map((item) => (item.id === segmentId ? modifiedSegment : item))
        );
      } else {
        setModifiedTexts((prev) => [...prev, modifiedSegment]);
      }
    }
  };

  const handleMappingRecord = (start, page) => {
    setStartTime(Number(start).toFixed(6));
    setCurrentPage(page);
  };

  useEffect(() => {
    if (onSubmit) {
      onSubmit(modifiedTexts);
    }
  }, [modifiedTexts, onSubmit]);

  useEffect(() => {
    if (searchTerm) {
      const results = [];
      sttData.forEach((segment, index) => {
        let position = 0;
        while (
          (position = segment.text
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase(), position)) !== -1
        ) {
          results.push({
            ref: resultRefs.current[index], // 각 세그먼트의 참조 저장
            position,
          });
          position += searchTerm.length; // 다음 검색어 위치로 이동
        }
      });
      setSearchResults(results);
    }
  }, [searchTerm, sttData, setSearchResults]);

  // 검색 결과에 맞게 스크롤 이동 처리
  useEffect(() => {
    if (currentIndex !== null && searchResults[currentIndex]?.ref) {
      searchResults[currentIndex].ref.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentIndex, searchResults]);

  return (
    <STTContainer>
      {isLoading ? (
        <LoadingIcon
          text="STT분석이 진행중입니다"
          style={{ paddingBottom: "10px" }}
        />
      ) : (
        <>
          {sttData && sttData.length > 0 ? (
            <STTResultList ref={resultListRef}>
              {sttData.map((segment, index) => (
                <STTResultItem
                  key={segment.id}
                  ref={(el) => (resultRefs.current[index] = el)} // 각 세그먼트 참조 저장
                >
                  <ResultLink
                    onClick={() =>
                      handleMappingRecord(segment.start, segment.page)
                    }
                  >
                    {formatTime(parseFloat(segment.start))} ~{" "}
                    {formatTime(parseFloat(segment.end))}
                  </ResultLink>
                  <ResultText
                    contentEditable={isEditMode}
                    onBlur={(e) =>
                      handleTextChange(segment.id, e.target.innerText)
                    }
                    suppressContentEditableWarning={true} // Prevent warning
                    $isEditMode={isEditMode}
                    style={{
                      backgroundColor:
                        segment.anomaly && isAnalyzed
                          ? analyzedColor
                          : "transparent", // anomaly일 경우 bold 처리
                    }}
                  >
                    {highlightText(segment.text, index)}{" "}
                    {/* 검색어 하이라이트 */}
                  </ResultText>
                </STTResultItem>
              ))}
            </STTResultList>
          ) : (
            <p>
              이곳에 텍스트가 들어갑니다. STT 관련 내용을 추가할 수 있습니다.
            </p>
          )}
        </>
      )}
    </STTContainer>
  );
};

export default STTComponent;
