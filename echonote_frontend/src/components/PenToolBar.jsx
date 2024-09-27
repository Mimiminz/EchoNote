import { useState } from "react";
import { FaPlayCircle, FaPauseCircle, FaStopCircle } from "react-icons/fa";
import { MdOutlineReplayCircleFilled } from "react-icons/md";
import ColorPalette from "@components/ColorPalette";
import {
  PenToolBarContainer,
} from "@components/styles/PenToolBar.style";

const PenToolBar = () => {
  return (
    <PenToolBarContainer>
      <ColorPalette />
    </PenToolBarContainer>
  );
};

export default PenToolBar;
