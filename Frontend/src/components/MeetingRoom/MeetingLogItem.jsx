import React from "react";
import styles from "./MeetingLogItem.module.css";

const MeetingLogItem = (props) => {
  const { meeting, clickMeetingLog } = props;

  const created = meeting.createdAt.split("T");
  const date = created[0];

  const clickMeetingLogHandler = () => {
    clickMeetingLog(meeting.sub_meeting_id, meeting.topic, date);
  };

  return (
    <li onClick={clickMeetingLogHandler} className={styles.logItem}>
      <span className={styles.topic}>{meeting.topic}</span>
      <span className={styles.date}>{date}</span>
    </li>
  );
};

export default MeetingLogItem;
