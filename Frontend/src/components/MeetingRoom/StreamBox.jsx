import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import Controllers from "./Controllers";
import Chat from "./Chat";
import styles from "./StreamBox.module.css";

const socket = io();

const StreamBox = (props) => {
  const [myStream, setMyStream] = useState(null);
  const [me, setMe] = useState("");
  const [chatOn, setChatOn] = useState(false);
  const [mute, setMute] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const videoGrid = useRef();
  const myVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((currentStream) => {
        setMyStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => setMe(id));
  }, []);

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

  const handleChatClick = () => {
    setChatOn((prev) => !prev);
  };

  return (
    <div className={styles.streamBox}>
      <div className={styles.streams}>
        <div ref={videoGrid}>
          <video ref={myVideo} autoPlay className={styles.myFace} />
          <h3 className={styles.userNickname} />
        </div>
      </div>
      {chatOn && <Chat />}
      <Controllers
        mute={mute}
        cameraOn={cameraOn}
        onMuteClick={handleMuteClick}
        onCameraClick={handleCameraClick}
        onChatClick={handleChatClick}
      />
    </div>
  );
};

export default StreamBox;
