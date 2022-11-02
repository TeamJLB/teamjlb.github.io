import React, { useState } from "react";
import StreamBox from "../../components/MeetingRoom/StreamBox";
import Memo from "../../components/MeetingRoom/Memo";
import styles from "./MeetingRoomPage.module.css";

const MeetingRoomPage = () => {
  return (
    <div className={styles.meetingRoomPage}>
      <div className={styles.sttBox}>
        <textarea className={styles.sttText} placeholder="stt 내용" />
      </div>
      <StreamBox />
      <Memo />
    </div>
  );
};

export default MeetingRoomPage;
