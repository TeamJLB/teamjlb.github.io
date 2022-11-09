import React from "react";
import StreamBox from "../../components/MeetingRoom/StreamBox";
import Memo from "../../components/MeetingRoom/Memo";
import styles from "./MeetingRoomPage.module.css";

const MeetingRoomPage = () => {
  return (
    <div className={styles.meetingRoomPage}>
      <StreamBox />
      <Memo />
    </div>
  );
};

export default MeetingRoomPage;
