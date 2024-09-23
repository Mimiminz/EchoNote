import { styled } from "styled-components";
import { theme } from "@/shared/styles/theme";

export const PdfPage = styled.div`
  display: flex;
  margin: auto;
  z-index: 1;
  background-color: ${theme.colors.subDiscription};
`;

export const PdfBackground = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: ${theme.colors.subDiscription};
`;

//임시 버튼 컨테이너
export const ButtonContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  gap: 10px;
  margin-top: 10px;
  width: 80px;
  height: 40px;
`;
