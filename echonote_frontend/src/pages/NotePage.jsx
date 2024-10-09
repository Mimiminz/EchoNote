import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ToolBar from "@components/ToolBar";
import PdfBar from "@components/PdfBar";
import RecordingBar from "@components/RecordingBar";
import STTBar from "@components/stt/STTBar";
import PdfViewer from "@components/PdfViewer";
import { Layout, MainContent } from "@/Layout.style";
import { useNoteStore } from "@stores/noteStore";
import { getNoteDetail } from "@services/noteApi";
import { getMemo } from "@services/memoApi";
import canvasStore from "@stores/canvasStore";
import shapeStore from "@stores/shapeStore";
import textStore from "@stores/textStore";

const NotePage = () => {
  const { id } = useParams();
  const [isDrawingEditorOpened, setIsDrawingEditorOpened] = useState(false);
  const [isToolBarCollapsed, setIsToolBarCollapsed] = useState(false); // ToolBar 접힘 상태 관리
  const { setNoteDetail } = useNoteStore();
  const { loadTextItems } = textStore();
  const { loadRectangles, loadCircles } = shapeStore();
  const { loadDrawings } = canvasStore();

  const toggleDrawingEditor = () => {
    setIsDrawingEditorOpened(!isDrawingEditorOpened);
  };

  const handleToggleToolBar = (collapsed) => {
    setIsToolBarCollapsed(collapsed); // ToolBar 접힘 상태 업데이트
  };

  useEffect(() => {
    // 페이지 마운트 시 노트 상세 데이터를 가져옴
    const fetchNoteDetail = async () => {
      try {
        const noteDetail = await getNoteDetail(id); // API 호출
        setNoteDetail(noteDetail); // 받아온 데이터를 Zustand에 저장
      } catch (error) {
        console.error("Error fetching note detail:", error);
      }
    };

    fetchNoteDetail();
  }, [id]);

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const memoData = await getMemo(id);
        // console.log(memoData);
        // 각 메모 요소로 전달
        loadTextItems(parseDetail(memoData.text));
        loadRectangles(parseDetail(memoData.rectangle));
        loadCircles(parseDetail(memoData.circle));
        loadDrawings(parseDetail(memoData.drawing));
      } catch (error) {
        console.error("Error fetching memo:", error);
      }
    };

    // fetchMemo();
  }, [id, loadTextItems, loadRectangles, loadCircles, loadDrawings]);

  const parseDetail = (obj) => {
    // 배열일 때, 각 요소에 대해 재귀 호출
    if (Array.isArray(obj)) {
      return obj.map((item) => parseDetail(item));
    }

    // 객체일 때
    if (typeof obj === "object" && obj !== null) {
      const newObj = { ...obj };

      // 'detail' 키가 존재하고, 그 값이 문자열일 때 JSON으로 파싱
      if (newObj.detail && typeof newObj.detail === "string") {
        try {
          newObj.detail = JSON.parse(newObj.detail);
        } catch (error) {
          console.error("Invalid JSON string in 'detail':", newObj.detail);
        }
      }

      // 다른 키에 대해서도 재귀 호출
      Object.keys(newObj).forEach((key) => {
        newObj[key] = parseDetail(newObj[key]);
      });

      return newObj;
    }

    // 기본값 반환 (배열이나 객체가 아닌 경우)
    return obj;
  };

  return (
    <>
      <ToolBar
        onToggleDrawingEditor={toggleDrawingEditor}
        noteId={id}
        onToggleToolBar={handleToggleToolBar}
      />
      <Layout>
        <RecordingBar />
        <PdfBar />
        <MainContent isCollapsed={isToolBarCollapsed}>
          <PdfViewer isDrawingEditorOpened={isDrawingEditorOpened} />
        </MainContent>
        <STTBar />
      </Layout>
    </>
  );
};

export default NotePage;
