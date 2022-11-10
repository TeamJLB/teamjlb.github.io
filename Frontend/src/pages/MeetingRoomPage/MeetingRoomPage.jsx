import React from "react";
import StreamBox from "../../components/MeetingRoom/StreamBox";
import Memo from "../../components/MeetingRoom/Memo";
import styles from "./MeetingRoomPage.module.css";
import { useLocation } from "react-router-dom";

const MeetingRoomPage = () => {
  const location = useLocation();
  const config = location.state.config;
  const userToken = location.state.config.headers["x-access-token"];
  const meetingId = location.state.meeting_id;
  const subMeetingId = location.state.subMeeting_id;
  const matchID = location.state.match_id;

  return (
    <div className={styles.meetingRoomPage}>
      <StreamBox
        config={config}
        userToken={userToken}
        meetingId={meetingId}
        subMeetingId={subMeetingId}
        matchID={matchID}
      />
      <Memo config={config} meetingId={meetingId} />
    </div>
  );
};

export default MeetingRoomPage;
