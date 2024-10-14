import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const SearchContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isOpen"]),
})`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 400px;
  height: 40px;
  background-color: white;
  border-radius: 17px;
  border: 1px solid #ccc;
  padding-right: ${({ isOpen }) => (isOpen ? "5px" : "0")};
  transition: width 0.4s ease, justify-content 0.3s ease;
  box-shadow: 0 2px 5px rgba(83, 83, 83, 0.1);
  position: relative;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding-left: 20px;
  font-size: 14px;
  background-color: transparent;
`;

export const SearchButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  color: #888;
  width: 35px;
  height: 35px;
`;

export const SearchIconContainer = styled.div`
  width: 20px;
  height: 20px;
  padding-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchResultCount = styled.span`
  font-size: 12px;
  color: #888;
  position: absolute;
  right: 7px;
  display: flex;
  align-items: center;
`;

export const SearchControlIcons = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export const SearchCloseIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: #888;
  margin-left: 4px;
`;
