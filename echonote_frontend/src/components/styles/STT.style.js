import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const STTContainer = styled.div`
  margin: 0;
  padding: 0;
  height: 570px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 10px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::-webkit-scrollbar {
    opacity: 1;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f5f9;
    border-radius: 10px;
  }
`;

export const STTResultList = styled.ul`
  margin: 0;
  padding: 0;
`;

export const STTResultItem = styled.li`
  margin-bottom: 10px;
  padding-bottom: 10px;
  list-style-type: none;
  font-size: 14px;
`;

export const ResultLink = styled.a`
  text-decoration: none;
  color: cornflowerblue;

  &:hover {
    color: purple;
  }
`;

export const ResultText = styled.p`
  margin: 0;
  padding: 0;
  background-color: ${(props) =>
    props.$isEditMode ? "lightyellow" : "transparent"};
`;

export const Highlight = styled.span`
  background-color: yellow;
`;

export const AnalzedHighlight = styled.span.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["keywordColor"]),
})`
  background-color: ${(props) => props.keywordColor || "#fff130"};
`;

export const KeywordHighlight = styled.span.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["keywordColor"]),
})`
  color: ${(props) => props.keywordColor || "#ff0000"};
  font-weight: bold;
`;

export const TextUnder = styled.span.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["keywordColor"]),
})`
  position: relative;

  &::after {
    content: "";
    width: 100%;
    height: 10px;
    background: ${(props) => props.keywordColor || "#99fee7"};
    position: absolute;
    display: inline-block;
    left: 0;
    bottom: 1px;
    z-index: -1;
  }
`;
