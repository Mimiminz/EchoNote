import {
  ModalBackdrop,
  ModalButton,
  ModalContainer,
  ModalHeader,
  ModalItem,
  ModalList,
} from "@components/styles/PdfSettingModal.style";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import canvasStore from "@stores/canvasStore";
import shapeStore from "@stores/shapeStore";
import textStore from "@stores/textStore";
import { saveMemo } from "@services/memoApi";

const PdfSettingModal = ({ isOpen, onClose, position, toggleAnalyzeModal }) => {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(isOpen);
  const { drawings } = canvasStore();
  const { rectangles, circles } = shapeStore();
  const { textItems } = textStore();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else if (visible) {
      setAnimate(true); // 닫기 애니메이션 시작
      const timer = setTimeout(() => {
        setAnimate(false);
        setVisible(false); // 애니메이션이 끝난 후 DOM에서 제거
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  if (!animate && !visible) return null;

  const stringifyDetail = (obj) => {
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
    // [TODO] pdf 노트 저장
    const note_id = 999;

    // 메모 저장
    const data = {
      id: note_id,
      text: stringifyDetail(textItems),
      rectangle: stringifyDetail(rectangles),
      circle: stringifyDetail(circles),
      drawing: stringifyDetail(drawings()),
    };

    saveMemo(data);
  };

  return (
    <ModalBackdrop
      className={isOpen ? "modal open" : "modal"}
      onClick={onClose}
    >
      <ModalContainer
        className={isOpen ? "modal-container open" : "modal-container"}
        style={{ top: position?.top, left: position?.left }}
      >
        <ModalHeader>
          <ModalButton onClick={() => toggleAnalyzeModal("음성")}>
            음성 분석
          </ModalButton>
          <ModalButton onClick={() => toggleAnalyzeModal("키워드")}>
            키워드 설정
          </ModalButton>
        </ModalHeader>
        <ModalList>
          <ModalItem>태그</ModalItem>
          <ModalItem onClick={() => handleFileStore()}>파일로 저장</ModalItem>
          <ModalItem>손가락으로 그리기 켜기</ModalItem>
        </ModalList>
      </ModalContainer>
    </ModalBackdrop>
  );
};

PdfSettingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.object,
  toggleAnalyzeModal: PropTypes.func.isRequired,
};

export default PdfSettingModal;
