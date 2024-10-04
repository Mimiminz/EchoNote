import { styled } from "styled-components";

export const PdfContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 95%;
  overflow: auto;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;
