import { useRef, useState, useEffect, useMemo } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { FaPlayCircle, FaPauseCircle, FaStopCircle } from "react-icons/fa";
import { MdOutlineReplayCircleFilled } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { PiRecordFill } from "react-icons/pi";
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
import {
  getPresignedUrl,
  saveRecordedFile,
  S3UploadRecord,
} from "@services/recordApi";
import { useAudioStore } from "@stores/recordStore";
import { useNoteStore } from "@stores/noteStore";
import textStore from "@/stores/textStore";
import shapeStore from "@/stores/shapeStore";
import Swal from "sweetalert2";
import canvasStore from "@stores/canvasStore";

const AudioWave = () => {
  const containerRef = useRef(null);
  const speedButtonRef = useRef(null);
  const speedBarRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedBarVisible, setSpeedBarVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playbackRates = [1, 1.25, 1.5, 1.75, 2];
  const { startTime, setStartTime, setRecordTime, recordTime } =
    useAudioStore();
  const {
    note_id,
    record_path,
    setRecordPath,
    stt_status,
    setSTTStatus,
    resetPageMovements,
    page_movement,
  } = useNoteStore();
  const { resetAllTimestamps: resetTextAllTimestamps } = textStore();
  const { resetAllTimestamps: resetShapeAllTimestamps } = shapeStore();
  const { resetAllTimestamps: resetDrawingAllTimestamps } = canvasStore();

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: true,
    timerProgressBar: true,
  });

  const resetTimestamp = () => {
    resetTextAllTimestamps();
    resetShapeAllTimestamps();
    resetDrawingAllTimestamps();
    resetPageMovements(); //페이지 이동 기록 초기화
  };

  const { wavesurfer, currentTime } = useWavesurfer({
    container: containerRef,
    height: 30,
    width: record_path ? 300 : 350,
    barHeight: 1,
    barWidth: 2,
    waveColor: "rgb(138, 111, 211)",
    progressColor: "rgb(89, 39, 226)",
    cursorWidth: 1,
    barRadius: 5,
    url: record_path || null,
    minPxPerSec: 30,
    hideScrollbar: true,
    plugins: useMemo(() => [], []),
  });

  const record = useMemo(() => {
    if (wavesurfer) {
      const recPlugin = wavesurfer.registerPlugin(
        RecordPlugin.create({
          renderRecordedAudio: true,
          cursorWidth: 0,
          barHeight: 5,
        })
      );

      recPlugin.on("record-progress", (time) => {
        setRecordTime(time / 1000);
      });

      recPlugin.on("record-end", async (blob) => {
        if (blob.size === 0) {
          alert("녹음이 너무 짧습니다! 새로운 녹음이 진행됩니다.");
          resetTimestamp();
          record.startRecording();
          return;
        }
        setSTTStatus("processing");
        // 녹음된 Blob 객체로부터 오디오 URL을 생성하고 상태에 저장
        const recordedUrl = URL.createObjectURL(blob);
        setRecordPath(recordedUrl);

        setIsRecording(false);
        setRecordTime(null);

        try {
          const data = await getPresignedUrl();
          const objectUrl = data.object_url;

          // Blob을 File 객체로 변환
          const wavFile = new File([blob], "record.wav", {
            type: "audio/wav",
          });
          if (!objectUrl) {
            return;
          }
          await S3UploadRecord(data.presigned_url, wavFile);

          // 서버로 녹음된 파일 정보 저장
          await saveRecordedFile(note_id, objectUrl, page_movement);
        } catch (error) {
          console.error("Error during recording process:", error);
          setIsRecording(false);
          return;
        }
      });

      return recPlugin;
    }
  }, [note_id, wavesurfer]);

  useEffect(() => {
    if (wavesurfer && startTime !== null && record_path) {
      wavesurfer.setTime(startTime);
      setTimeout(() => {
        wavesurfer.getCurrentTime(), setStartTime(null);
      }, 200); // 200ms 정도의 딜레이를 주고 확인
    }
  }, [startTime, wavesurfer, record_path]);

  const togglePlayPause = () => {
    if (!wavesurfer) return;
    setIsPlaying(!isPlaying);
    wavesurfer.playPause();
  };

  const toggleStartStop = () => {
    if (record.isPaused()) {
      record.resumeRecording();
    } else if (record.isRecording()) {
      record.pauseRecording();
    } else {
      handleStartStopRecording();
    }

    setIsRecording(!isRecording);
  };

  const handleStartStopRecording = async () => {
    if (stt_status === "processing") {
      Toast.fire({
        icon: "warning",
        title: "현재 STT분석이 진행중이에요",
        text: "분석이 끝난 후에 다시 시도해주세요",
      });
      return;
    }
    const devices = await RecordPlugin.getAvailableAudioDevices();
    const deviceId = devices[0]?.deviceId;

    try {
      if (recordTime >= 1) {
        record.stopRecording(); // 녹음 중단
      } else {
        setRecordPath(null);
        setRecordTime(0);
        resetTimestamp();
        record.startRecording({ deviceId });
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

  useEffect(() => {
    const controller = new AbortController(); // AbortController 생성

    if (wavesurfer) {
      wavesurfer.on("finish", () => {
        setIsPlaying(false);
      });
    }

    return () => {
      // 컴포넌트 언마운트 시 wavesurfer를 안전하게 해제
      if (wavesurfer) {
        try {
          wavesurfer.destroy(); // wavesurfer가 존재할 때만 destroy 호출
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Error during wavesurfer destruction:", error);
          }
        }
      }
      // 비동기 작업을 안전하게 취소
      controller.abort();
    };
  }, [wavesurfer]);

  return (
    <AudioContainer>
      {record_path ? (
        <PlayPauseButton onClick={togglePlayPause}>
          {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
        </PlayPauseButton>
      ) : (
        <PlayPauseButton onClick={toggleStartStop}>
          {isRecording ? <FaStopCircle /> : <PiRecordFill />}
        </PlayPauseButton>
      )}

      <WaveContainer ref={containerRef} />

      <Timer>
        {new Date((!record_path ? recordTime ?? 0 : currentTime) * 1000)
          .toISOString()
          .substring(14, 19)}
      </Timer>
      {record_path && (
        <>
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
        </>
      )}
      <StopReplayButton onClick={handleStartStopRecording}>
        {record_path ? <MdOutlineReplayCircleFilled /> : <IoIosSend />}
      </StopReplayButton>
    </AudioContainer>
  );
};

export default AudioWave;
