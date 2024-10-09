import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

// 툴바 전체 컨테이너
export const ToolBarContainer = styled.div`
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(77, 77, 77, 0.1);
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
`;

// 상단 제목과 접기 버튼을 담은 헤더 영역
export const ToolBarHeader = styled.div`
  display: flex;
  justify-content: center; /* Center the title horizontally */
  align-items: center; /* Center the title vertically */
  margin: 5px 0px;
  width: 100%;
  padding-bottom: 10px;
  position: relative; /* For absolute positioning of the setting button */
  border-bottom: 1px solid rgba(43, 43, 43, 0.062);
`;

// 부드러운 애니메이션을 위한 컨테이너
export const AnimatedToolBarContent = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["collapsed"]),
})`
  overflow: hidden;
  max-height: ${({ collapsed }) => (collapsed ? "0" : "300px")};
  opacity: ${({ collapsed }) => (collapsed ? "0" : "1")};
  transition: max-height 0.5s ease, opacity 0.5s ease;
`;

export const ToolBarContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 7px;
  margin-bottom: 2px;
  width: 100%;
`;

export const ToolBarButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #d3d3d3;
  margin: 0 10px;
`;

export const ToolBarIcon = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isActive"].includes(prop), // isActive만 필터링
})`
  font-size: 15px;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    color: ${(props) => props.theme.colors.iconHover};
  }

  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.iconHover : theme.colors.iconColor};
`;

// 오른쪽에 위치하는 Collapse 버튼 (SideBarButton)
export const SideBarButton = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
`;

export const IconButton = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isActive"].includes(prop), // isActive만 필터링
})`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin: 0 5px;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.iconHover : theme.colors.iconColor};
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.textColor};
  margin: 0;
`;

export const SaveButton = styled.div`
  position: absolute;
  right: 60px;
  align-items: center; /* Vertical centering */
  justify-content: center;
  cursor: pointer;
`;

export const SettingButton = styled.div`
  position: absolute;
  right: 10px; /* Ensure it aligns on the far right */
  display: flex;
  align-items: center; /* Vertical centering */
  justify-content: center;
  cursor: pointer;
`;

export const ListButton = styled.div`
  position: absolute;
  left: 10px; /* Ensure it aligns on the far right */
  display: flex;
  align-items: center; /* Vertical centering */
  justify-content: center;
  cursor: pointer;
`;

//폰트 사이즈, 도형 색상 열고 닫는용
export const ToolBarIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 폰트, 도형 애니메이션
export const ToolBarIconDetail = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isOpen"].includes(prop), // isOpen만 필터링
})`
  max-width: ${(props) => (props.isOpen ? "80px" : "0")};
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  transform-origin: left;
  transition: max-width 0.5s ease, opacity 0.5s ease, visibility 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-left: ${(props) => (props.isOpen ? "5px" : "0")};
  position: relative;
`;

export const FontSizeText = styled.div`
  font-size: 14px;
`;

export const FontSizeButton = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isActive"].includes(prop), // isActive만 필터링
})`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 10px;
  margin: 0 5px;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.iconHover : theme.colors.iconColor};
`;
