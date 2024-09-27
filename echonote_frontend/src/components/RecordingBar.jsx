import useSidebarStore from "@stores/sideBarStore";
import { RecordingBarContainer } from "@components/styles/RecordingBar.style";
import AudioWave from "@components/AudioWave";

const RecordingBar = () => {
  const { isRecordingBarOpened } = useSidebarStore();

  return (
    <RecordingBarContainer isOpened={isRecordingBarOpened}>
      <AudioWave />
    </RecordingBarContainer>
  );
};

export default RecordingBar;
