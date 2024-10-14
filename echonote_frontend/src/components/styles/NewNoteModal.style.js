import styled, { keyframes } from "styled-components";

// 모달이 나타날 때 애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px); /* 모달이 살짝 위에서 내려오는 느낌 */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 모달이 사라질 때 애니메이션
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

// 모달의 배경 스타일 (화면 전체를 덮는 배경)
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 최상위에 나타나게 설정 */

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.3s ease-out;
`;

// 모달 컨테이너 스타일
export const ModalContainer = styled.div`
  background-color: #fff;
  width: 400px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 모달 헤더 스타일
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: bold;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
  }
`;

// 모달 내용 스타일
export const ModalContent = styled.div`
  p {
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
  }

  .options {
    display: flex;
    justify-content: space-between;
  }
`;

// 옵션 선택 버튼과 이미지 스타일
export const ModalOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  img {
    width: 100px;
    height: 150px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  p {
    font-size: 14px;
  }
`;

// 선택 버튼 스타일
export const OptionButton = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${(props) => (props.selected ? "#ff6347" : "#ddd")};
  border-radius: 50%;
  background-color: ${(props) => (props.selected ? "#ff6347" : "transparent")};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.selected ? "#ff6347" : "#f5f5f5")};
  }
`;

// 태그 UI 영역 스타일
export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center; /* 텍스트와 아이콘을 수직으로 중앙 정렬 */
  font-size: 15px;
  padding: 5px 10px;
  background-color: transparent;
  border: 2px solid #87a8ca;
  color: #0c437e;
  border-radius: 20px;
  box-shadow: 1px 2px 1px 0px #8888884b;
`;

export const TagRemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center; /* 아이콘을 수직으로 중앙 정렬 */
  margin-left: 5px; /* 아이콘과 텍스트 사이에 적당한 간격 추가 */
  padding: 0;
`;

// 모달 푸터 스타일
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    border: none;
    display: inline-block;
    padding: 10px 20px;
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    transition: 0.25s;
    background-color: #6896c7;
    color: #ffffff;
    font-size: 15px;

    &:hover {
      transform: scale(1.05);
      cursor: pointer;
    }
  }
`;

export const TitleBox = styled.input`
  width: 85%;
  padding: 10px;
  margin-top: 10px;
  font-size: 16px;
  border: 2px solid #d6d6d6;
  border-radius: 5px;
  box-shadow: 0 0 3px rgba(179, 179, 179, 0.5);
  outline: none;

  &:focus {
    border-color: #a5a5a5;
    box-shadow: 0 0 8px rgba(112, 112, 112, 0.6);
  }
`;

export const TagBox = styled.input`
  flex: 1;
  width: 85%;
  padding: 8px;
  font-size: 14px;
  border: 2px solid #d6d6d6;
  border-radius: 5px;
  box-shadow: 0 0 2px rgba(179, 179, 179, 0.5);
  outline: none;

  &:focus {
    border-color: #a5a5a5;
    box-shadow: 0 0 8px rgba(112, 112, 112, 0.6);
  }
`;

export const TagButton = styled.button`
  background-color: #6896c7;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
  border-bottom-color: rgba(0, 0, 0, 0.34);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.34) inset,
    0 2px 0 -1px rgba(0, 0, 0, 0.13), 0 3px 0 -1px rgba(0, 0, 0, 0.08),
    0 3px 13px -1px rgba(0, 0, 0, 0.21);

  &:hover {
    background-color: #2c598a;
  }
`;

// PDF 업로드 버튼 스타일
export const UploadButton = styled.label`
  background-color: #6896c7;
  color: white;
  border: none;
  padding: 7px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
  border-bottom-color: rgba(0, 0, 0, 0.34);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.34) inset,
    0 2px 0 -1px rgba(0, 0, 0, 0.13), 0 3px 0 -1px rgba(0, 0, 0, 0.08),
    0 3px 13px -1px rgba(0, 0, 0, 0.21);

  &:hover {
    background-color: #2c598a;
  }
`;
