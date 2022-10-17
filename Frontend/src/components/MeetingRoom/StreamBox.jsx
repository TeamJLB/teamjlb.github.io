import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import Controllers from "./Controllers";
import Chat from "./Chat";
import styles from "./StreamBox.module.css";
import Modal from "../UI/Modal";

const socket = io("http://localhost:3000/");

const StreamBox = (props) => {
  const [myStream, setMyStream] = useState(null);
  const [chatOn, setChatOn] = useState(false);
  const [mute, setMute] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [modalOn, setModalOn] = useState(true);
  // const [roomName, setRoomName] = useState("");

  // 임시 데이터
  const roomName = "123";

  const videoGrid = useRef();
  const myVideo = useRef();

  const confirm = () => console.log("연결 완료 !!!");

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

    socket.emit("join_room", roomName, confirm);

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

  const handleChatClick = () => {
    setChatOn((prev) => !prev);
  };

  // ///// TEMP /////////////////////
  // const EnteredRoomName = useRef();

  // const closeHandler = () => {
  //   setModalOn(false);
  // };

  // const startMedia = () => {
  //   getMedia();
  //   console.log("연결완료");
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setModalOn(false);
  //   socket.emit("join-room", EnteredRoomName.current.value, startMedia);
  //   setRoomName(EnteredRoomName.current.value);
  //   EnteredRoomName.current.value = "";
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
  //////////////////

  return (
    <>
      {/* {modalOn && (
        <Modal onClose={closeHandler} header={header} contents={contents} />
      )} */}
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
    </>
  );
};

export default StreamBox;
