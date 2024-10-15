import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyzeModal from "@components/modal/AnalyzeModal";
import PdfSettingModal from "@components/modal/PdfSettingModal";
import { RiSpeakLine } from "react-icons/ri";
import {
  FaPen,
  FaTextHeight,
  FaImage,
  FaShapes,
  FaStar,
  FaRegCircle,
  FaRegSquare,
  FaCaretDown,
} from "react-icons/fa";
import { BiWindowAlt, BiChevronsDown, BiChevronsUp } from "react-icons/bi";
import {
  IoMicSharp,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { useSidebarStore } from "@stores/sideBarStore";
import drawingTypeStore from "@stores/drawingTypeStore";
import pageStore from "@stores/pageStore";
import { useNoteStore } from "@stores/noteStore";
import * as St from "@components/styles/ToolBar.style";
import { VscSettings, VscArrowLeft } from "react-icons/vsc";
import textStore from "@stores/textStore";
import Dropdown from "@components/common/Dropdown";
import canvasStore from "@stores/canvasStore";
import shapeStore from "@stores/shapeStore";
import { useSTTStore } from "@stores/sttStore";
import { updateMemo, saveMemo } from "@services/memoApi";

const ToolBar = ({ onToggleDrawingEditor, onToggleToolBar, noteId }) => {
  const {
    isPdfBarOpened,
    isSTTBarOpened,
    togglePdfBar,
    toggleSTTBar,
    isRecordingBarOpened,
    toggleRecordingBar,
    resetSidebarStore,
  } = useSidebarStore();

  const {
    mode,
    setTextMode,
    setShapeMode,
    shapeMode,
    setRectangleMode,
    setCircleMode,
    setPenMode,
    resetType,
  } = drawingTypeStore();

  const { nextPage, prevPage, zoomIn, zoomOut, setCurrentPage } = pageStore();
  const { fontProperty, setFontSize, resetTextItems, textItems } = textStore();
  const { resetSTTStore } = useSTTStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPdfSettingModalOpen, setIsPdfSettingModalOpen] = useState(false);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [buttonPosition, setButtonPosition] = useState(null);
  const settingButtonRef = useRef(null);
  const [isPenActive, setIsPenActive] = useState(false);
  const navigate = useNavigate();
  const { note_name, resetNoteStore, update_at } = useNoteStore();
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const fontSizeRef = useRef(null);

  const handleFontDropDown = () => {
    setIsFontSizeOpen((prev) => !prev);
  };

  // 1부터 64까지의 숫자 배열(폰트사이즈)
  const fontSizeOptions = Array.from({ length: 64 }, (_, index) => index + 1);
  const { drawings, resetAllDrawings, resetStrockColor } = canvasStore();
  const { rectangles, circles, resetAllShapes } = shapeStore();

  const resetItems = () => {
    resetTextItems();
    resetAllShapes();
    setCurrentPage(1);
    resetAllDrawings();
    resetType();
    resetStrockColor();
    resetSidebarStore();
    resetNoteStore();
    resetSTTStore();
  };

  //도형모드 off -> 사각형 모드 -> 원 모드 -> 도형모드 off
  const handleShapeMode = () => {
    if (!mode.shape) {
      setShapeMode();
      setRectangleMode();
    } else if (shapeMode.rectangle) {
      setCircleMode();
    } else if (shapeMode.circle) {
      setShapeMode();
    }
  };

  const toggleCollapse = () => {
    onToggleToolBar(!isCollapsed); // 상태 변경 시 상위 컴포넌트에 전달
    setIsCollapsed(!isCollapsed);
  };

  const togglePdfModal = () => {
    if (settingButtonRef.current) {
      const rect = settingButtonRef.current.getBoundingClientRect();
      const modalWidth = 260;
      setButtonPosition({
        top: rect.bottom + 10 + window.scrollY,
        left: rect.right - modalWidth + window.scrollX,
      });
    }

    setIsPdfSettingModalOpen(!isPdfSettingModalOpen);
  };

  const moveNoteList = () => {
    navigate(-1);
    resetItems();
  };

  const toggleAnalyzeModal = () => {
    setIsAnalyzeModalOpen(!isAnalyzeModalOpen);
  };

  const handleAnalyzeModalOpen = (ModalType) => {
    setIsPdfSettingModalOpen(false);
    setModalType(ModalType);

    const modalWidth = 300;
    const adjustedLeft = buttonPosition.left - modalWidth;

    setButtonPosition((prevPosition) => ({
      ...prevPosition,
      left: adjustedLeft,
    }));

    setTimeout(() => {
      setIsAnalyzeModalOpen(true);
    }, 200);
  };

  useEffect(() => {
    if (buttonPosition && buttonPosition.left === 710) {
      setIsAnalyzeModalOpen(true);
      console.log("AnalyzeModal이 열렸습니다.");
    }
  }, [buttonPosition]);

  const handlePenClick = () => {
    setIsPenActive(!isPenActive);
    setPenMode();
    onToggleDrawingEditor();
  };

  const stringifyDetail = (obj) => {
    if (!obj || obj.length === 0) return;

    // 배열일 때, 각 요소에 대해 재귀 호출
    if (Array.isArray(obj)) {
      return obj.map((item) => stringifyDetail(item));
    }

    // 객체일 때
    if (typeof obj === "object" && obj !== null) {
      const newObj = { ...obj };

      // 'detail' 키가 존재하고, 그 값이 객체일 때 문자열로 변환
      if (newObj.detail && typeof newObj.detail === "object") {
        newObj.detail = JSON.stringify(newObj.detail);
      }

      // 다른 키에 대해서도 재귀 호출
      Object.keys(newObj).forEach((key) => {
        newObj[key] = stringifyDetail(newObj[key]);
      });

      return newObj;
    }

    // 기본값 반환 (배열이나 객체가 아닌 경우)
    return obj;
  };

  const handleFileStore = () => {
    // 메모 저장
    const data = {
      id: noteId,
      text: stringifyDetail(textItems) || {},
      rectangle: stringifyDetail(rectangles) || {},
      circle: stringifyDetail(circles) || {},
      drawing: stringifyDetail(drawings()) || {},
    };

    // console.log(data);
    if (update_at) {
      // console.log("update memo");
      updateMemo(data);
    } else {
      // console.log("save memo");
      saveMemo(data);
    }
    resetItems();
    navigate("/");
  };

  return (
    <St.ToolBarContainer>
      <St.AnimatedToolBarContent collapsed={isCollapsed}>
        <St.ToolBarHeader>
          <St.ListButton onClick={moveNoteList}>
            <VscArrowLeft style={{ marginLeft: "10px", fontSize: "20px" }} />
          </St.ListButton>
          <St.Title>
            {note_name}
            <FaStar style={{ marginLeft: "10px", color: "gold" }} />
          </St.Title>
          <St.SaveButton onClick={() => handleFileStore()}>Save</St.SaveButton>
          <St.SettingButton ref={settingButtonRef} onClick={togglePdfModal}>
            <VscSettings style={{ marginRight: "10px", fontSize: "20px" }} />
          </St.SettingButton>
        </St.ToolBarHeader>
      </St.AnimatedToolBarContent>

      <St.ToolBarContent>
        <St.ToolBarButton>
          <St.IconButton
            as={IoMicSharp}
            onClick={toggleRecordingBar}
            isActive={isRecordingBarOpened}
          />
          <St.Divider />
          <St.IconButton
            as={FaPen}
            onClick={handlePenClick}
            isActive={mode.pen}
          />
          <St.ToolBarIconContainer>
            <St.ToolBarIcon
              as={FaTextHeight}
              onClick={setTextMode}
              isActive={mode.text}
            />
            <St.ToolBarIconDetail
              ref={fontSizeRef}
              isOpen={mode.text}
              onClick={handleFontDropDown}
            >
              <St.FontSizeText>{fontProperty.fontSize}</St.FontSizeText>
              <St.FontSizeButton as={FaCaretDown} />
              <Dropdown
                isOpen={isFontSizeOpen}
                setIsOpen={setIsFontSizeOpen}
                parentRef={fontSizeRef}
                options={fontSizeOptions}
                onSelect={setFontSize}
                selectedOption={fontProperty.fontSize}
              />
            </St.ToolBarIconDetail>
          </St.ToolBarIconContainer>
          <St.ToolBarIcon as={FaImage} />
          <St.ToolBarIcon
            as={
              !mode.shape
                ? FaShapes
                : shapeMode.rectangle
                ? FaRegSquare
                : FaRegCircle
            }
            onClick={handleShapeMode}
            isActive={mode.shape}
          />
          <St.Divider />
          <St.IconButton as={LuZoomOut} onClick={zoomOut} />
          <St.IconButton as={LuZoomIn} onClick={zoomIn} />
          <St.Divider />
          <St.IconButton as={IoChevronBackOutline} onClick={prevPage} />
          <St.IconButton as={IoChevronForwardOutline} onClick={nextPage} />
        </St.ToolBarButton>
        <St.SideBarButton>
          <St.IconButton
            as={BiWindowAlt}
            onClick={togglePdfBar}
            isActive={isPdfBarOpened}
          />
          <St.IconButton
            as={RiSpeakLine}
            onClick={toggleSTTBar}
            isActive={isSTTBarOpened}
          />
          {isCollapsed ? (
            <St.IconButton
              as={BiChevronsDown}
              onClick={toggleCollapse}
              isActive={isCollapsed}
            />
          ) : (
            <St.IconButton
              as={BiChevronsUp}
              onClick={toggleCollapse}
              isActive={isCollapsed}
            />
          )}
        </St.SideBarButton>
      </St.ToolBarContent>

      <PdfSettingModal
        isOpen={isPdfSettingModalOpen}
        onClose={togglePdfModal}
        position={buttonPosition}
        toggleAnalyzeModal={handleAnalyzeModalOpen}
      />

      <AnalyzeModal
        isOpen={isAnalyzeModalOpen}
        onClose={toggleAnalyzeModal}
        position={buttonPosition}
        modalType={modalType}
      />
    </St.ToolBarContainer>
  );
};

export default ToolBar;
