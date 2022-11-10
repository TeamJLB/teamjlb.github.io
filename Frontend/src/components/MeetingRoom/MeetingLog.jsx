import styles from "./MeetingLog.module.css";
import React from "react";
import axios from "axios";
import host_config from "../../config/serverHost";
import MeetingLogItem from "./MeetingLogItem";

const MeetingLog = (props) => {
  const { config, setModalOn, subMeetings, setMeetingLog, setMeetingLogOn } =
    props;

  const onClose = () => {
    setModalOn(false);
  };

  const clickMeetingLog = (subMeetingId, topic, date) => {
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/summaries/summary/${subMeetingId}`,
        config
      )
      .then((res) => {
        setModalOn(false);
        console.log(res.data.result);
        setMeetingLog({
          date: date,
          topic: topic,
          logContent: res.data.result,
        });
      });
    setMeetingLogOn(true);
  };

  const subMeetingList =
    subMeetings.length !== 0 ? (
      <ul className={styles.logList}>
        {subMeetings.map((meeting) => {
          return (
            <MeetingLogItem
              key={meeting.sub_meeting_id}
              meeting={meeting}
              clickMeetingLog={clickMeetingLog}
            />
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
