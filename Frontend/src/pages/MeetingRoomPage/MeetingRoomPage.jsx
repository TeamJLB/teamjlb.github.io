import React, { useState } from "react";
import StreamBox from "../../components/StreamBox";
import Controlers from "../../components/Controlers";
import Chat from "../../components/Chat";
import Memo from "../../components/Memo";
import "./MeetingRoomPage.css";

const MeetingRoomPage = () => {
  return (
    <div className="meetingRoomPage">
      <div className="room">
        <StreamBox />
        <Memo />
      </div>
    </div>
  );
};

export default MeetingRoomPage;
