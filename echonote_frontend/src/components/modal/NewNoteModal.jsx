import * as St from "@components/styles/NewNoteModal.style";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import {
  getPdfPresignedUrl,
  S3UploadPdf,
  savePdfFile,
} from "@services/noteApi";
import { useNavigate } from "react-router-dom";

const NewNoteModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState(""); // 노트 제목 상태
  const [tags, setTags] = useState([]); // 태그 상태
  const [tagInput, setTagInput] = useState(""); // 태그 입력 상태

  const navigate = useNavigate();

  // 파일 선택 처리 함수
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      console.log("선택된 파일:", file);
    } else {
      console.error("파일이 선택되지 않았습니다.");
    }
  };

  // 노트 생성 처리 함수
  const handleCreateNote = async () => {
    if (!selectedFile) {
      alert("PDF 파일을 선택해주세요.");
      return;
    }

    setIsUploading(true); // 업로드 중 상태 설정

    try {
      // 1. presigned URL 받아오기
      const { presigned_url, object_url } = await getPdfPresignedUrl();
      console.log("Presigned URL:", presigned_url);
      console.log("Object URL:", object_url);

      // 2. S3에 PDF 파일 업로드
      await S3UploadPdf(presigned_url, selectedFile);
      console.log("파일 업로드 성공");

      // 3. 서버에 업로드된 파일 정보 저장
      const savedData = await savePdfFile(object_url, title, tags);
      console.log("노트 저장 성공, note_id:", savedData.note_id);

      // 4. note_id 페이지로 이동
      navigate(`/note/${savedData.note_id}`);
    } catch (error) {
      console.error("노트 생성 과정에서 오류 발생:", error);
    } finally {
      setIsUploading(false); // 업로드 상태 해제
      onClose(); // 모달 닫기
    }
  };

  // 태그 추가 처리 함수
  const handleTagAdd = () => {
    if (tags.length >= 5) {
      alert("태그는 최대 5개까지 추가할 수 있습니다.");
      return;
    }
    if (tagInput.trim() !== "" && tagInput.length <= 6) {
      setTags([...tags, tagInput]);
      setTagInput(""); // 입력 필드 초기화
    } else {
      alert("태그는 6자를 넘을 수 없습니다.");
    }
  };

  // 태그 삭제 처리 함수
  const handleTagRemove = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  if (!isOpen) return null;

  return (
    <St.ModalBackdrop onClick={onClose}>
      <St.ModalContainer onClick={(e) => e.stopPropagation()}>
        <St.ModalHeader>
          <h2>새 노트</h2>
          <button onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </St.ModalHeader>
        <St.ModalContent>
          <div>
            <label htmlFor="noteTitle">노트 제목</label>
            <St.TitleBox
              type="text"
              id="noteTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="노트 제목을 입력하세요"
            />
          </div>
          <p>생성할 메모의 PDF를 등록해보세요</p>

          <St.UploadButton htmlFor="pdfUpload" onClick={handleFileChange}>
            PDF 파일 선택
          </St.UploadButton>
          <input
            type="file"
            id="pdfUpload"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {selectedFile && <p>선택된 파일: {selectedFile.name}</p>}

          <div style={{ marginTop: "20px" }}>
            <label htmlFor="tagInput">태그 추가</label>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <St.TagBox
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="태그를 입력하세요 (최대 5개)"
              />
              <St.TagButton onClick={handleTagAdd}>추가</St.TagButton>
            </div>

            <St.TagContainer>
              {tags.map((tag, index) => (
                <St.Tag key={index}>
                  <span>{tag}</span>
                  <St.TagRemoveButton onClick={() => handleTagRemove(index)}>
                    <IoMdClose />
                  </St.TagRemoveButton>
                </St.Tag>
              ))}
            </St.TagContainer>
          </div>
        </St.ModalContent>

        <St.ModalFooter>
          <button onClick={handleCreateNote} disabled={isUploading}>
            {isUploading ? "생성 중..." : "생성하기"}
          </button>
        </St.ModalFooter>
      </St.ModalContainer>
    </St.ModalBackdrop>
  );
};

export default NewNoteModal;
