import styled from "styled-components";

export const PenToolBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  max-width: 500px;
  padding: 10px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 2px 3px rgba(65, 65, 65, 0.1);
  margin: 0 auto;
  position: absolute;
  bottom: 130px; /* 화면의 밑에서 50px 위로 위치 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;
