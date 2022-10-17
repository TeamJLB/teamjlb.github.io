import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import Controllers from "./Controllers";
import styles from "./StreamBox.module.css";
import Modal from "../UI/Modal";

const socket = io.connect("http://localhost:3000/");

const StreamBox = (props) => {
  const [myStream, setMyStream] = useState(null);
  const [mute, setMute] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  // const [roomName, setRoomName] = useState("");

  // 임시 데이터
  const roomName = "123";

  const videoGrid = useRef();
  const myVideo = useRef();

  const confirm = () => {
    console.log(roomName);
    console.log("연결 완료 !!!");
  };

  useEffect(() => {
    // const peer = new Peer()

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((currentStream) => {
        setMyStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.emit("join-room", roomName, confirm);

    socket.on("welcome", () => {
      console.log("누군가 들어옴");
    });
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

  ///// TEMP /////////////////////
  // const EnteredRoomName = useRef();

  // const closeHandler = () => {
  //   setModalOn(false);
  // };

  // const startMedia = () => {
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       audio: true,
  //       video: true,
  //     })
  //     .then((currentStream) => {
  //       setMyStream(currentStream);
  //       myVideo.current.srcObject = currentStream;
  //     });

  //   console.log("연결완료");
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   console.log(EnteredRoomName.current.value);
  //   setRoomName(EnteredRoomName.current.value);
  //   EnteredRoomName.current.value = "";
  //   setModalOn(false);
  // };

  // const header = "방 입장하기";
  // const contents = (
  //   <div>
  //     <form onSubmit={handleSubmit}>
  //       <input
  //         placeholder="방 이름"
  //         required
  //         type="text"
  //         ref={EnteredRoomName}
  //       />
  //       <button>입장</button>
  //     </form>
  //   </div>
  // );
  // ////////////////

  return (
    <>
      <div className={styles.streamBox}>
        <div className={styles.streams}>
          <div ref={videoGrid}>
            <video ref={myVideo} autoPlay className={styles.myFace} />
            <h3 className={styles.userNickname} />
          </div>
        </div>
        <Controllers
          mute={mute}
          cameraOn={cameraOn}
          onMuteClick={handleMuteClick}
          onCameraClick={handleCameraClick}
        />
      </div>
    </>
  );
};

export default StreamBox;
