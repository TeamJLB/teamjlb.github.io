import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
import Controllers from "./Controllers";
import styles from "./StreamBox.module.css";
import Modal from "../UI/Modal";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import host_config from "../../config/serverHost";

const correctPunctuation = (givenTranscript) => `${givenTranscript}.`;

const StreamBox = (props) => {
  // [로컬 서버에서 테스트]
  const socket = io.connect(`http://localhost:${host_config.socket_port}/`);
  // [실제 서버에서 테스트]
  // const socket = io.connect(`http://${host_config.current_host}:${host_config.socket_port}/`);

  const location = useLocation();
  const navigate = useNavigate();

  const userToken = location.state.config.headers["x-access-token"];
  const roomName = location.state.meeting_id;

  const [peerId, setPeerId] = useState("");
  const [myStream, setMyStream] = useState(null);

  const [mute, setMute] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const videoGrid = useRef();
  const myVideo = useRef();
  
  const [correctedTranscript, setCorrectedTranscript] = useState('');
  const prevFinalTranscriptRef = useRef();

  let textSummaryScript = '';

  // [음성 인식 stt]
  const recognition = SpeechRecognition;

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const language = 'ko';

  // [음성 인식 트리거]
  function startSpeechRecognition() {
    if (listening) {
      recognition.stopListening();
      return;
    }
    recognition.startListening({ continuous: true, language : language});
    // console.log(listening);
  }

  // ------------------------------------
  // let myStream;
  let peer;
  // const peer = new Peer();
  const peers = {};

  const confirm = (userstream) => {
    console.log(roomName, userstream["user"], "✅ 연결됨");
  };

  useEffect(() => {
    peer = new Peer();

    // 음성 인식 환경이 마련됐는지 확인 (Chrome)
    if (!browserSupportsSpeechRecognition) {
      console.log(`Browser doesn't support speech recognition`);
      alert(`Browser doesn't support speech recognition`);
    } else{
      console.log(`Browser ready for speech recognition`);
      // startSpeechRecognition();
    }
      
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((currentStream) => {
        let streamId = currentStream.id;
        setMyStream(currentStream);
        addVideoStream(myVideo.current, currentStream, streamId);
        videoGrid.current.append(myVideo.current);

        peer.on("open", (peerId) => {
          setPeerId(peerId);
          socket.emit(
            "join-room",
            roomName,
            { user: peerId, stream: streamId },
            confirm
          );
        });

        socket.on("user-connected", (userStream) => {
          const userId = userStream["user"];
          console.log("User connected : ", userId);
          const call = peer.call(userId, currentStream);
          const video = document.createElement("video");
          video.setAttribute("autoplay", "playsinline");

          call.on("stream", (videoStream) => {
            addVideoStream(video, videoStream, userId);
            videoGrid.current.append(video);
          });

          // call.on("close", () => {
          //   video.remove();
          // });
        });

        peer.on("call", (call) => {
          call.answer(currentStream);
          const video = document.createElement("video");
          video.setAttribute("autoplay", "playsinline");

          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream, peerId);
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
    if (finalTranscript != '') {
      // console.log(prevFinalTranscript);
      const newSpeech = finalTranscript.substring(prevFinalTranscript.length).trim();
      setCorrectedTranscript(`${correctedTranscript} ${correctPunctuation(newSpeech)}`);
    }
  }, [finalTranscript]);
  // ---

  const addVideoStream = (video, stream, peerId) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => video.play());
  };

  const handleMuteClick = () => {
    // 음성인식 상태 바꾸기
    if (!mute && listening) {
      recognition.stopListening();
      // recognition.abortListening();
      // console.log(transcript);
      // console.log(interimTranscript);
      // console.log(finalTranscript);
    } else if (mute && !listening) {
      recognition.startListening({continuous: true, language : language});
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
    socket.disconnect();
    peer?.destroy();
    myStream.getTracks().forEach((track) => track.stop());
    setMyStream(null);
    myVideo.srcObject = null;
    clearAllVideos();
    navigate("/meetingList", { state: { userToken } });
    window.location.reload();
  };

  const clearAllVideos = () => {
    const videoGrid = document.querySelector("#videos");
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video.id != myVideo) {
        videoGrid.removeChild(video);
      }
    });
  };

  return (
    <>
      <div className={styles.sttBox}>
        <span className={styles.sttText} id="sttText">{correctedTranscript}</span>
      </div>
      <div className={styles.streamBox}>
        <div className={styles.streams}>
          <div id="videos" ref={videoGrid}>
            <video
              id="myVideo"
              ref={myVideo}
              muted
              autoPlay
              className={styles.myFace}
            />
            <h3 className={styles.userNickname} />
          </div>
        </div>
        <Controllers
          mute={mute}
          cameraOn={cameraOn}
          onMuteClick={handleMuteClick}
          onCameraClick={handleCameraClick}
          onLeaveClick={handleLeaveClick}
        />
      </div>
    </>
  );
};

export default StreamBox;
