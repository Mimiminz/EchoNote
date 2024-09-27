import styled from "styled-components";
import { shouldNotForwardPropsWithKeys } from "@shared/utils/shouldForwardProp";

export const RecordingBarContainer = styled.div.withConfig({
  shouldForwardProp: shouldNotForwardPropsWithKeys(["isOpened"]),
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  padding: 10px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 2px 3px rgba(65, 65, 65, 0.1);
  margin: 0 auto;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  opacity: ${(props) => (props.isOpened ? "1" : "0")};
  transform: ${(props) =>
    props.isOpened ? "translateX(-50%)" : "translateX(-50%) translateY(-20px)"};
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

export const PlayPauseButton = styled.button`
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.colors.recordButton};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 27px;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 16px;
  padding: 0 5px;

  &:hover {
    color: #007bff;
  }
`;
