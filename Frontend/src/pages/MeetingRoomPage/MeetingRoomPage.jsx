import React, { useState } from "react";
import StreamBox from "../../components/MeetingRoom/StreamBox";
import Memo from "../../components/MeetingRoom/Memo";
import styles from "./MeetingRoomPage.module.css";

const MeetingRoomPage = () => {
  return (
    <div className={styles.meetingRoomPage}>
      <div className={styles.room}>
        <StreamBox />
        <Memo />
      </div>
    </div>
  );
};

export default MeetingRoomPage;
