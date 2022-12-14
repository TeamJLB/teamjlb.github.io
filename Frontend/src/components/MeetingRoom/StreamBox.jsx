import { useState, useRef, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
import Memo from "./Memo/Memo";
import Controllers from "./Controllers";
import styles from "./StreamBox.module.css";
import axios from "axios";
import MeetingHeader from "./MeetingHeader";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import SummaryContents from "../History/SummaryContents";
import host_config from "../../config/serverHost";
import Loading from "../UI/Loading";
import close from "../../assets/close.png";

const correctPunctuation = (givenTranscript) => `${givenTranscript}.`;

const StreamBox = (props) => {
  const { config, userToken, meetingId, subMeetingId, matchID, userName } =
    props;

  // [로컬 서버에서 테스트]
  // const socket = io.connect(`http://localhost:${host_config.socket_port}/`);
  // [실제 서버에서 테스트]
  const socket = io.connect(
    `http://${host_config.current_host}:${host_config.socket_port}/`
  );
  const navigate = useNavigate();

  const [myStream, setMyStream] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [topic, setTopic] = useState("");
  const [mute, setMute] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [sttOn, setSttOn] = useState(true);
  const [meetingLog, setMeetingLog] = useState(null);
  const [meetingLogOn, setMeetingLogOn] = useState(false);
  const [memo, setMemo] = useState(null);

  const [isFinish, setIsFinish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoGrid = useRef();
  const myVideo = useRef();
  const originalStt = useRef();

  const [correctedTranscript, setCorrectedTranscript] = useState("");
  const prevFinalTranscriptRef = useRef();

  const [summarizedResult, setSummarizedResult] = useState(null);

  // [음성 인식 stt]
  const recognition = SpeechRecognition;

  const {
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const language = "ko";

  // [음성 인식 트리거]
  function startSpeechRecognition() {
    if (listening) {
      recognition.stopListening();
      return;
    }
    recognition.startListening({ continuous: true, language: language });
  }

  /**
   * 회의 내용 요약
   */
  function textSummarize(originalText) {
    // text 에 공백이나 아무 글이 없을 때 실행 안 시키도록 하기
    if (originalText === "") return;

    socket.emit("stt_data", originalText);

    // 요약 내용 결과 처리
    socket.on("result", (summaryResult) => {
      console.log(summaryResult);

      if (typeof summaryResult !== "undefined") {
        setSummarizedResult(summaryResult);

        console.log("summary process ended");
      } else {
        console.log("summary process failed");
      }
      return;
    });
  }

  let peer;

  const confirm = (userstream) => {
    console.log(meetingId, userstream["user"], "✅ 연결됨");
  };

  useEffect(() => {
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/search/${meetingId}`,
        config
      )
      .then((res) => {
        setRoomName(res.data.result[0].meeting_name);
      });

    peer = new Peer();

    // 음성 인식 환경이 마련됐는지 확인 (Chrome)
    if (!browserSupportsSpeechRecognition) {
      console.log(`Browser doesn't support speech recognition`);
      alert(`Browser doesn't support speech recognition`);
    } else {
      console.log(`Browser ready for speech recognition`);
      // startSpeechRecognition();
    }

    if (!isMicrophoneAvailable) {
      console.log(`마이크 안 됨`);
    } else {
      console.log(`마이크 됨`);
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((currentStream) => {
        currentStream
          .getAudioTracks()
          .forEach((track) => (track.enabled = !track.enabled));

        let streamId = currentStream.id;
        setMyStream(currentStream);
        addVideoStream(myVideo.current, currentStream);
        videoGrid.current.append(myVideo.current);

        peer.on("open", (peerId) => {
          socket.emit(
            "join-room",
            meetingId,
            { user: peerId, stream: streamId },
            confirm
          );
        });

        socket.on("user-connected", (userStream) => {
          const userId = userStream["user"];
          const call = peer.call(userId, currentStream);
          const video = document.createElement("video");
          video.setAttribute("autoplay", "playsinline");

          call.on("stream", (videoStream) => {
            addVideoStream(video, videoStream);
            videoGrid.current.append(video);
          });
        });

        peer.on("call", (call) => {
          call.answer(currentStream);
          const video = document.createElement("video");
          video.setAttribute("autoplay", "playsinline");

          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
            videoGrid.current.append(video);
          });
        });

        socket.on("user-disconnected", (userStream) => {
          const userId = userStream["user"];
          const streamId = userStream["stream"];
          console.log("User disconnected : ", userId);
          const video = document.querySelectorAll("video");
          let removeVideo;
          for (let i = 0; i < video.length; i++) {
            if (video[i].srcObject.id === streamId) {
              removeVideo = video[i];
            }
          }
          removeVideo.remove();
        });
      });
  }, []);

  // [음성 인식 결과 처리] - stt 사이 마침표 추가
  useEffect(() => {
    prevFinalTranscriptRef.current = finalTranscript;
  });

  const prevFinalTranscript = prevFinalTranscriptRef.current;

  useEffect(() => {
    if (finalTranscript != "") {
      const newSpeech = finalTranscript
        .substring(prevFinalTranscript.length)
        .trim();
      setCorrectedTranscript(
        (prev) => `${prev} ${correctPunctuation(newSpeech)}`
      );
    }
  }, [finalTranscript]);

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => video.play());
  };

  const handleMuteClick = () => {
    // 음성인식 상태 바꾸기
    if (!mute && listening) {
      recognition.stopListening();
      // recognition.abortListening();
    } else if (mute && !listening) {
      recognition.startListening({ continuous: true, language: language });
    }
    console.log(mute, listening);

    // mute 값 상태 바꾸기
    setMute((prev) => !prev);

    // 음향 트랙 바꾸기
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  };

  const handleCameraClick = () => {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setCameraOn((prev) => !prev);
  };

  const handleLeaveClick = () => {
    if (topic === "") {
      alert("❗️오늘의 주제를 입력해주세요❗️");
      return;
    }
    setIsLoading(true);
    // 요약 진행
    if (correctedTranscript) {
      textSummarize(correctedTranscript);
    }
    // TODO - 요약 API
    setIsFinish(true);
  };

  useEffect(() => {
    if ((isFinish && !correctedTranscript) || summarizedResult) {
      axios.post(
        `http://${host_config.current_host}:${host_config.current_port}/summaries/summary`,
        {
          match_id: matchID,
          summary_content: summarizedResult,
          original_content: originalStt.current.innerText,
        },
        config
      );

      axios.patch(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/openMeeting/${meetingId}/${subMeetingId}`,
        { topic: topic },
        config
      );

      axios.post(
        `http://${host_config.current_host}:${host_config.current_port}/memos/memo`,
        {
          subMeeting_id: subMeetingId,
          content: memo.value,
        },
        config
      );

      axios
        .patch(
          `http://${host_config.current_host}:${host_config.current_port}/meetings/closeMeeting/${meetingId}/${subMeetingId}`,
          { matchId: matchID },
          config
        )
        .then((res) => {
          if (res.data.isSuccess) {
            socket.disconnect();
            peer?.destroy();
            myStream.getTracks().forEach((track) => track.stop());
            setMyStream(null);
            myVideo.srcObject = null;
            clearAllVideos();
            navigate("/meetingList", { state: { userToken } });
            window.location.reload();
          } else {
            alert(res.data.message);
          }
        });
      setIsLoading(false);
    }
  }, [isFinish, summarizedResult]);

  const clearAllVideos = () => {
    const videoGrid = document.querySelector("#videos");
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video.id != myVideo) {
        videoGrid?.removeChild(video);
      }
    });
  };

  const logCloseHandler = () => {
    setMeetingLogOn(false);
  };

  const logContents =
    meetingLog &&
    meetingLog.logContent &&
    meetingLog.logContent.length !== 0 ? (
      <SummaryContents items={meetingLog.logContent} />
    ) : (
      <div className={styles.zeroNote}>요약본이 기록되지 않았어요 😢</div>
    );

  return (
    <>
      {isLoading && <Loading />}
      <div className={styles.streamBox}>
        <MeetingHeader
          config={config}
          meetingId={meetingId}
          roomName={roomName}
          setTopic={setTopic}
          setMeetingLog={setMeetingLog}
          setMeetingLogOn={setMeetingLogOn}
        />
        <div className={styles.streams}>
          <div
            id="videos"
            ref={videoGrid}
            className={`${styles.videos} ${meetingLogOn && styles.logOn}`}
          >
            <video
              id="myVideo"
              ref={myVideo}
              muted
              autoPlay
              className={styles.myFace}
            />
          </div>
        </div>
        {meetingLogOn && meetingLog && (
          <div className={styles.meetingLog}>
            <span className={styles.meetingTopic}>{meetingLog.topic}</span>
            <span className={styles.meetingDate}>
              {meetingLog.date}에 기록됨
            </span>
            <button className={styles.closeBtn} onClick={logCloseHandler}>
              <img width="15px" height="15px" src={close}></img>
            </button>
            <div className={styles.meetingLogContent}>{logContents}</div>
          </div>
        )}
        {sttOn && (
          <div className={styles.sttBox}>
            <div className={styles.speakerIcon}>🔊 </div>
            <div className={styles.sttText} id="sttText" ref={originalStt}>
              {correctedTranscript}
            </div>
          </div>
        )}
        <Controllers
          mute={mute}
          cameraOn={cameraOn}
          sttOn={sttOn}
          onMuteClick={handleMuteClick}
          onCameraClick={handleCameraClick}
          onLeaveClick={handleLeaveClick}
          setSttOn={setSttOn}
        />
      </div>
      <Memo
        config={config}
        meetingId={meetingId}
        setMemo={setMemo}
        userName={userName}
      />
    </>
  );
};

export default memo(StreamBox);
