import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import styles from "./MeetingHeader.module.css";
import MeetingLog from "./MeetingLog";
import host_config from "../../config/serverHost";

const MeetingHeader = (props) => {
  const {
    config,
    meetingId,
    roomName,
    setTopic,
    setMeetingLog,
    setMeetingLogOn,
  } = props;

  const [editMode, setEditMode] = useState("true");
  const [modalOn, setModalOn] = useState(false);
  const [subMeetings, setSubMeetings] = useState([]);

  const topic = useRef();

  useEffect(() => {
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/meetingHistory/?meetingId=${meetingId}`,
        config
      )
      .then((res) => {
        setSubMeetings(res.data.result);
      });
  }, []);

  const clickMeetingLogHandler = () => {
    setModalOn((prev) => !prev);
  };

  const clickTopicHandler = () => {
    if (editMode) topic.current.disabled = true;
    else topic.current.disabled = false;
    setEditMode((prev) => !prev);
    setTopic(topic.current.value);
  };

  return (
    <>
      <div className={styles.meetingHeader}>
        <div className={styles.roomName} onClick={clickMeetingLogHandler}>
          💡 [{meetingId}] {roomName}
        </div>
        <div className={styles.topicForm}>
          <input placeholder="오늘의 주제를 입력하세요." ref={topic} />
          <button onClick={clickTopicHandler}>
            {editMode ? "완료" : "수정"}
          </button>
        </div>
      </div>
      {modalOn && (
        <MeetingLog
          config={config}
          setModalOn={setModalOn}
          subMeetings={subMeetings}
          setMeetingLog={setMeetingLog}
          setMeetingLogOn={setMeetingLogOn}
        />
      )}
    </>
  );
};

export default MeetingHeader;
