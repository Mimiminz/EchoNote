import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import {
  STTContainer,
  STTResultList,
  STTResultItem,
  ResultLink,
  ResultText,
} from "@/components/styles/STT.style";
import { useAudioStore } from "@stores/recordStore";
import { getSTTResult } from "@services/sttApi";
import { useSearchStore } from "@stores/sideBarStore";
import { useNoteStore } from "@stores/noteStore";

// 시간 포맷팅 함수 (초를 분:초로 변환)
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const STTComponent = ({ searchTerm, isEditMode, onSubmit }) => {
  const [sttData, setSttData] = useState([]);
  const [modifiedTexts, setModifiedTexts] = useState([]);
  const { setStartTime } = useAudioStore();
  const { note_id, record_path, stt_status, setSTTStatus } = useNoteStore();

  const {
    currentIndex,
    setSearchResults,
    currentKeyword,
    setCurrentKeyword,
    isKeyword,
  } = useSearchStore();
  const resultRefs = useRef([]);

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
      console.log("stt 불러옴");
      fetchData();
    } else if (stt_status === "processing") {
      console.log("stt 분석중");
      const eventSource = new EventSource(
        `${import.meta.env.VITE_API_URL}voice/sse?note_id=${note_id}`
      ); // notd_id를 키값으로 들고다님 반드시 필요!

      console.log("SSE 연결 시도 중...");

      // 연결 시 초기 메시지 처리
      eventSource.onopen = (event) => {
        console.log("연결 완료: ", event);
      };

      // STT 완료 이벤트 처리
      eventSource.addEventListener("stt_complete", (event) => {
        console.log("STT 완료: ", event.data);

        eventSource.close();
        alert("STT 완료!");

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
        eventSource.close(); // 연결 종료
      };

      // 컴포넌트 언마운트 시 SSE 연결 닫기
      return () => {
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
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              typeof part === "string" &&
              part.toLowerCase() === searchTerm?.toLowerCase()
                ? {
                    backgroundColor: "yellow", // 검색어 하이라이트 색상
                  }
                : isKeyword &&
                  currentKeyword.some(
                    (keyword) =>
                      typeof part === "string" &&
                      part.toLowerCase() === keyword.toLowerCase()
                  )
                ? {
                    color: "lightgreen",
                    backgroundColor: "black",
                  }
                : {}
            }
          >
            {part}
          </span>
        ))}
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

  useEffect(() => {
    if (onSubmit) {
      onSubmit(modifiedTexts);
    }
  }, [modifiedTexts, onSubmit]);

  useEffect(() => {
    if (searchTerm) {
      const results = [];
      sttData.forEach((segment, index) => {
        if (segment.text.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({ index, ref: resultRefs.current[index] });
        }
      });
      setSearchResults(results);
    }
  }, [searchTerm, sttData, setSearchResults]);

  return (
    <STTContainer>
      {sttData && sttData.length > 0 ? (
        <STTResultList>
          {sttData.map((segment, index) => (
            <STTResultItem
              key={segment.id}
              ref={(el) => (resultRefs.current[index] = el)} // 각 세그먼트 참조 저장
            >
              <ResultLink
                onClick={() => setStartTime(Number(segment.start).toFixed(6))}
              >
                {formatTime(parseFloat(segment.start))} ~{" "}
                {formatTime(parseFloat(segment.end))}
              </ResultLink>
              <ResultText
                contentEditable={isEditMode}
                onBlur={(e) => handleTextChange(segment.id, e.target.innerText)}
                suppressContentEditableWarning={true} // Prevent warning
                $isEditMode={isEditMode}
                style={{
                  fontWeight: segment.anomaly ? "bold" : "normal", // anomaly일 경우 bold 처리
                }}
              >
                {highlightText(segment.text, index)} {/* 검색어 하이라이트 */}
              </ResultText>
            </STTResultItem>
          ))}
        </STTResultList>
      ) : (
        <p>이곳에 텍스트가 들어갑니다. STT 관련 내용을 추가할 수 있습니다.</p>
      )}
    </STTContainer>
  );
};

export default STTComponent;
