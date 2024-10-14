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
import { exportPdfWithTextAndShapes } from "@services/PDFSave/PdfSave";
import { useNoteStore } from "@/stores/noteStore";
import { deleteNote } from "@services/noteApi";
import { useNavigate } from "react-router-dom";
import canvasStore from "@stores/canvasStore";
import shapeStore from "@stores/shapeStore";
import { useSidebarStore } from "@stores/sideBarStore";
import drawingTypeStore from "@stores/drawingTypeStore";
import textStore from "@stores/textStore";
import pageStore from "@stores/pageStore";
import Swal from "sweetalert2";

const PdfSettingModal = ({ isOpen, onClose, position, toggleAnalyzeModal }) => {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(isOpen);
  const { note_id, pdf_path } = useNoteStore();
  const navigate = useNavigate();

  const { setCurrentPage } = pageStore();
  const { resetAllDrawings, resetStrockColor } = canvasStore();
  const { resetAllShapes } = shapeStore();
  const { resetSidebarStore } = useSidebarStore();
  const { resetNoteStore } = useNoteStore();
  const { resetType } = drawingTypeStore();
  const { resetTextItems } = textStore();

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

  const handleExportPdf = async () => {
    try {
      await exportPdfWithTextAndShapes(pdf_path); // PDF 내보내기 함수 호출
      alert("PDF가 성공적으로 내보내졌습니다.");
    } catch (error) {
      console.error("PDF 내보내기 실패:", error);
      alert("PDF 내보내기에 실패했습니다.");
    }
  };

  const handleDeletePdf = (id) => {
    Swal.fire({
      title: "노트를 삭제하시겠습니까?",
      text: "삭제된 노트는 복원할 수 없어요",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ee4949",
      cancelButtonColor: "#858585",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteNote(id); // ensure this is awaited properly
          resetItems();
          navigate(-1);

          Swal.fire({
            title: "삭제완료",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting note:", error);
          Swal.fire({
            title: "삭제 실패",
            text: "노트를 삭제하는 동안 문제가 발생했습니다.",
            icon: "error",
          });
        }
      }
    });
  };

  const resetItems = () => {
    resetTextItems();
    resetAllShapes();
    setCurrentPage(1);
    resetAllDrawings();
    resetType();
    resetStrockColor();
    resetSidebarStore();
    resetNoteStore();
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
          <ModalItem onClick={handleExportPdf}>파일로 저장</ModalItem>
          <ModalItem onClick={() => handleDeletePdf(note_id)}>
            노트 삭제
          </ModalItem>
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
