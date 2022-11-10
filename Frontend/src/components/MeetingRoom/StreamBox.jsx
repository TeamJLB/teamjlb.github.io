import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
import Controllers from "./Controllers";
import styles from "./StreamBox.module.css";
import host_config from "../../config/serverHost";
import axios from "axios";
import MeetingHeader from "./MeetingHeader";

const StreamBox = (props) => {
  const { config, userToken, meetingId, subMeetingId, matchID } = props;

  // [로컬 서버에서 테스트]
  // const socket = io.connect(`http://localhost:${host_config.socket_port}/`);
  // [실제 서버에서 테스트]
  const socket = io.connect(
    `http://${host_config.current_host}:${host_config.socket_port}/`
  );
  const navigate = useNavigate();

  console.log("stream");
  console.log("sub", subMeetingId, "match", matchID);

  const [myStream, setMyStream] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [topic, setTopic] = useState("");

  const [mute, setMute] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const [meetingLog, setMeetingLog] = useState(null);
  const [meetingLogOn, setMeetingLogOn] = useState(true);

  const videoGrid = useRef();
  const myVideo = useRef();

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

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((currentStream) => {
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
          console.log("User connected : ", userId);
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

  const addVideoStream = (video, stream) => {
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
    axios
      .patch(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/openMeeting/${meetingId}/${subMeetingId}`,
        { topic: topic },
        config
      )
      .then((res) => console.log(res));
    axios
      .patch(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/closeMeeting/${meetingId}/${subMeetingId}`,
        { matchId: matchID },
        config
      )
      .then((res) => {
        if (res.data.isSuccess) {
          console.log(res.data.result);
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
  };

  const clearAllVideos = () => {
    const videoGrid = document.querySelector("#videos");
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video.id != myVideo) {
        videoGrid?.removeChild(video);
      }
    });
  };

  return (
    <>
      <div className={styles.streamBox}>
        <MeetingHeader
          config={config}
          meetingId={meetingId}
          roomName={roomName}
          setTopic={setTopic}
          setMeetingLog={setMeetingLog}
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
        {meetingLogOn && (
          <div className={styles.meetingLog}>요약본 나올 곳</div>
        )}
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
