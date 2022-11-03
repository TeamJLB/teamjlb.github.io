import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
import Controllers from "./Controllers";
import styles from "./StreamBox.module.css";
import Modal from "../UI/Modal";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import host_config from "../../config/serverHost";

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

  const [mute, setMute] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const videoGrid = useRef();
  const myVideo = useRef();
  
  const [finalSpan, setFinalSpan] = useState('final');
  const [interimSpan, setInterimSpan] = useState('interim');

  const FIRST_CHAR = /\S/;
  const TWO_LINE = /\n\n/g;
  const ONE_LINE = /\n/g;

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

  /**
   * 음성 인식 결과 처리
   */
  // recognition.onresult = function (event) {
  //   console.log('onresult', event);

  //   let interimTranscript = '';
  //   if (typeof event.results === 'undefined') {
  //     recognition.onend = null;
  //     recognition.stop();
  //     return;
  //   }

  //   for (let i = event.resultIndex; i < event.results.length; ++i) {
  //     const transcript = event.results[i][0].transcript;

  //     if (event.results[i].isFinal) {
  //       finalTranscript += transcript + '.';
  //     } else {
  //       interimTranscript += transcript + '.';
  //     }
  //   }

  //   finalTranscript = capitalize(finalTranscript);
    // final_span.innerHTML = linebreak(finalTranscript);
    // interim_span.innerHTML = linebreak(interimTranscript);

    // console.log('finalTranscript', finalTranscript);
    // console.log('interimTranscript', interimTranscript);
  // };

  /**
   * 음성 인식 트리거
   */
   function start() {
    if (listening) {
      recognition.stopListening();
      // recognition.stop();
      return;
    }
    recognition.startListening({ language : language});
    // recognition.lang = language;
    // recognition.start();
    // ignoreEndProcess = false;

    console.log(listening);
    console.log(finalTranscript);
    console.log(interimTranscript);
    // finalTranscript = '';
    // $final_span.innerHTML = '';
    // $interim_span.innerHTML = '';
  }

  /**
   * 개행 처리
   * @param {string} s
   */ 
  function linebreak(s) {
    return s.replace(TWO_LINE, '<p></p>').replace(ONE_LINE, '<br>');
  }  

  /**
   * 첫문자를 대문자로 변환
   * @param {string} s
   */ 
  function capitalize(s) {
    return s.replace(FIRST_CHAR, function (m) {
      return m.toUpperCase();
    });  
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
    // start();

    if (!browserSupportsSpeechRecognition) {
      console.log(`Browser doesn't support speech recognition`);
      alert(`Browser doesn't support speech recognition`);
    } else{
      console.log(`Browser ready for speech recognition`);
    }
    recognition.startListening();
      
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

  const addVideoStream = (video, stream, peerId) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => video.play());
  };

  const handleMuteClick = () => {
    if (!mute && listening) {
      recognition.abortListening();
      console.log(transcript);
    } else {
      recognition.startListening();
    }
    console.log(listening);

    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMute((prev) => !prev);
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
        <span className={styles.final} id="final_span">{finalSpan}</span>
        <span className={styles.interim} id="interim_span">{interimSpan}</span>
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
