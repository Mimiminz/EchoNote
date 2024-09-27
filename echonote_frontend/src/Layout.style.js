import styled from "styled-components";

// 레이아웃 컨테이너: 사이드바와 메인 콘텐츠를 배치하는 Flex 레이아웃
export const Layout = styled.div`
  display: flex;
  position: relative; /* 툴바와 독립된 고정 레이아웃 */
  height: 100%;
`;

// 중앙 메인 콘텐츠를 Flex를 사용해 가운데 정렬
export const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.backgroundColor};
`;

// 스타일 설정 (1280x800으로 고정)
export const rootStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden", // 화면이 넘치지 않도록 설정
  backgroundColor: "black", // 검은색 배경
};

export const appStyle = {
  width: "1280px", // 고정 너비
  height: "800px", // 고정 높이
  backgroundColor: "white", // App 배경색 설정
};
