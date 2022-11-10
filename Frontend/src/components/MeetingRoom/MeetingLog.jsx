import styles from "./MeetingLog.module.css";
import React from "react";
import axios from "axios";
import host_config from "../../config/serverHost";

const MeetingLog = (props) => {
  const { setModalOn, subMeetings } = props;

  const onClose = () => {
    setModalOn(false);
  };

  const subMeetingList =
    subMeetings.length !== 0 ? (
      <ul className={styles.logList}>
        {subMeetings.map((meeting) => {
          const created = meeting.createdAt.split("T");
          const date = created[0];
          return (
            <li>
              <span className={styles.topic}>{meeting.topic}</span>
              <span className={styles.date}>{date}</span>
            </li>
          );
        })}
      </ul>
    ) : (
      <div className={styles.zeroNote}>이전에 기록된 요약본이 없어요 😢</div>
    );

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.meetingLog}>{subMeetingList}</div>
    </>
  );
};

export default MeetingLog;
