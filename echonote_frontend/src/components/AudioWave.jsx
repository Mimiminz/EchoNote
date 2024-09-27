import { useRef, useState, useEffect, useMemo } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { FaPlayCircle, FaPauseCircle, FaStopCircle } from "react-icons/fa";
import { MdOutlineReplayCircleFilled } from "react-icons/md";
import { PiRecordFill, PiRecordBold } from "react-icons/pi";
import { RiSpeedFill } from "react-icons/ri";
import {
  Timer,
  WaveContainer,
  SpeedBarContainer,
  SpeedButton,
  SpeedOption,
  AudioContainer,
  PlayPauseButton,
  StopReplayButton,
} from "@components/styles/AudioWave.style";

const AudioWave = () => {
  const containerRef = useRef(null);
  const speedButtonRef = useRef(null);
  const speedBarRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedBarVisible, setSpeedBarVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null); // 녹음 파일이 없으면 null
  const playbackRates = [1, 1.25, 1.5, 1.75, 2];

  // Wavesurfer + RecordPlugin 설정
  const { wavesurfer, currentTime } = useWavesurfer({
    container: containerRef,
    height: 30,
    width: 300,
    barHeight: 1,
    barWidth: 2,
    waveColor: "rgb(138, 111, 211)",
    progressColor: "rgb(89, 39, 226)",
    cursorWidth: 1,
    barRadius: 5,
    url: audioUrl || null,
    minPxPerSec: 30,
    hideScrollbar: true,
    plugins: useMemo(
      () => [
        RecordPlugin.create({
          renderRecordedAudio: true,
          scrollingWaveform: true,
          cursorWidth: 0,
          barHeight: 5,
        }),
      ],
      [audioUrl]
    ),
  });

  const record = useMemo(() => {
    if (wavesurfer) {
      const recPlugin = wavesurfer.registerPlugin(RecordPlugin.create());
      recPlugin.on("record-end", (blob) => {
        const recordedUrl = URL.createObjectURL(blob);
        setAudioUrl(recordedUrl);
        setIsRecording(false);
      });
      return recPlugin;
    }
  }, [wavesurfer]);

  const togglePlayPause = () => {
    if (!wavesurfer) return;
    setIsPlaying(!isPlaying);
    wavesurfer.playPause();
  };

  const handleStartStopRecording = async () => {
    try {
      // 마이크 접근 권한 요청
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // 장치 탐색
      const devices = await RecordPlugin.getAvailableAudioDevices();
      const deviceId = devices[0]?.deviceId;

      if (isRecording) {
        record?.stopRecording();
        setIsRecording(false);
      } else {
        record?.startRecording({ deviceId });
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Error accessing microphone or starting recording", error);
    }
  };
  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(speed);
    }
    setSpeedBarVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        speedButtonRef.current &&
        !speedButtonRef.current.contains(event.target) &&
        speedBarRef.current &&
        !speedBarRef.current.contains(event.target)
      ) {
        setSpeedBarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <AudioContainer>
      {audioUrl ? (
        <PlayPauseButton onClick={togglePlayPause}>
          {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
        </PlayPauseButton>
      ) : (
        <PlayPauseButton onClick={handleStartStopRecording}>
          {isRecording ? <PiRecordFill /> : <PiRecordBold />}
        </PlayPauseButton>
      )}

      <WaveContainer ref={containerRef} />

      <Timer>
        {new Date(currentTime * 1000).toISOString().substring(14, 19)}
      </Timer>

      <SpeedButton
        ref={speedButtonRef}
        onClick={() => setSpeedBarVisible(!speedBarVisible)}
      >
        <RiSpeedFill />
        {`${playbackRate}`}
      </SpeedButton>

      <SpeedBarContainer ref={speedBarRef} visible={speedBarVisible}>
        {playbackRates.map((rate) => (
          <SpeedOption
            key={rate}
            selected={playbackRate === rate}
            onClick={() => handleSpeedChange(rate)}
          >
            {`${rate}X`}
          </SpeedOption>
        ))}
      </SpeedBarContainer>

      <StopReplayButton onClick={handleStartStopRecording}>
        {audioUrl ? <MdOutlineReplayCircleFilled /> : <FaStopCircle />}
      </StopReplayButton>
    </AudioContainer>
  );
};

export default AudioWave;
