import { useState } from "react";
import { RiSpeakLine } from "react-icons/ri";
import { FaPen, FaTextHeight, FaImage, FaShapes, FaStar } from "react-icons/fa";
import { BiWindowAlt, BiChevronsDown, BiChevronsUp } from "react-icons/bi";
import { IoMicSharp } from "react-icons/io5";
import useSidebarStore from "@stores/sideBarStore";
import {
  Divider,
  ToolBarContainer,
  ToolBarHeader,
  ToolBarContent,
  ToolBarButton,
  Title,
  IconButton,
  ToolBarIcon,
  SideBarButton,
  AnimatedToolBarContent,
} from "@components/styles/ToolBar.style";

const ToolBar = () => {
  const {
    isPdfBarOpened,
    isSTTBarOpened,
    togglePdfBar,
    toggleSTTBar,
    isRecordingBarOpened,
    toggleRecordingBar,
  } = useSidebarStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <ToolBarContainer>
      <AnimatedToolBarContent collapsed={isCollapsed}>
        <ToolBarHeader>
          <Title>
            pdf file name
            <FaStar style={{ marginLeft: "10px", color: "gold" }} />
          </Title>
        </ToolBarHeader>
      </AnimatedToolBarContent>

      <ToolBarContent>
        <ToolBarButton>
          <IconButton
            as={IoMicSharp}
            onClick={toggleRecordingBar}
            isActive={isRecordingBarOpened}
          />
          <Divider />
          <ToolBarIcon as={FaPen} />
          <ToolBarIcon as={FaTextHeight} />
          <ToolBarIcon as={FaImage} />
          <ToolBarIcon as={FaShapes} />
        </ToolBarButton>
        <SideBarButton>
          <IconButton
            as={BiWindowAlt}
            onClick={togglePdfBar}
            isActive={isPdfBarOpened}
          />
          <IconButton
            as={RiSpeakLine}
            onClick={toggleSTTBar}
            isActive={isSTTBarOpened}
          />
          {isCollapsed ? (
            <IconButton
              as={BiChevronsUp}
              onClick={toggleCollapse}
              isActive={!isCollapsed}
            />
          ) : (
            <IconButton
              as={BiChevronsDown}
              onClick={toggleCollapse}
              isActive={!isCollapsed}
            />
          )}
        </SideBarButton>
      </ToolBarContent>
    </ToolBarContainer>
  );
};

export default ToolBar;
