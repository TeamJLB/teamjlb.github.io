import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
import Controllers from "./Controllers";
import styles from "./StreamBox.module.css";
import Modal from "../UI/Modal";
import host_config from "../../config/serverHost";

const StreamBox = (props) => {
  // [로컬 서버에서 테스트]
  // const socket = io.connect(`http://localhost:${host_config.socket_port}/`);
  // [실제 서버에서 테스트]
  const socket = io.connect(`http://${host_config.current_host}:${host_config.socket_port}/`);

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

  // let myStream;
  let peer;
  // const peer = new Peer();
  const peers = {};

  const confirm = (userstream) => {
    console.log(roomName, userstream["user"], "✅ 연결됨");
  };

  useEffect(() => {
    peer = new Peer();

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
