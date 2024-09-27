import useSidebarStore from "@stores/sideBarStore";
import { useState } from "react";
import {
  STTBarContainer,
  STTBarContent,
  STTBarHeader,
  STTBarSearchRow,
  ToggleSwitch,
  IconButton,
  Divider,
} from "@components/styles/STTBar.style";
import { FaPen } from "react-icons/fa";
import SearchBar from "@components/common/SearchBar";

const STTBar = () => {
  const { isSTTBarOpened } = useSidebarStore();
  const [isHighLight, setIsHighLight] = useState(false);

  const toggleHighLight = () => {
    setIsHighLight(!isHighLight);
  };

  return (
    <>
      <STTBarContainer isOpened={isSTTBarOpened}>
        <STTBarHeader>
          <ToggleSwitch isToggled={isHighLight} onClick={toggleHighLight} />
          <IconButton>
            <FaPen />
          </IconButton>
        </STTBarHeader>
        <STTBarSearchRow>
          <SearchBar />
        </STTBarSearchRow>
        <Divider />
        <STTBarContent isOpened={isSTTBarOpened}>
          <p>이곳에 텍스트가 들어갑니다. STT 관련 내용을 추가할 수 있습니다.</p>
        </STTBarContent>
      </STTBarContainer>
    </>
  );
};

export default STTBar;
