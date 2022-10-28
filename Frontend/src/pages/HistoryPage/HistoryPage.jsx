import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HistoryTable from "../../components/History/HistoryTable";
import Modal from "../../components/UI/Modal";
import HistoryContents from "../../components/History/HistoryContents";
import MemoContents from "../../components/History/MemoContents";
import styles from "./HistoryPage.module.css";

const HistoryPage = () => {
  const location = useLocation();
  const config = location.state.config;
  const meetingId = location.state.meeting_id;

  const [meetingInfo, setMeetingInfo] = useState();
  const [modalOn, setModalOn] = useState(false);
  const [header, setHeader] = useState("");
  const [contents, setContents] = useState("");

  const clickSummary = (subMeetingId) => {
    setModalOn(true);
    setHeader("회의 요약본");
    axios
      .get(`http://3.39.169.146/summaries/summary/${subMeetingId}`, config)
      .then((res) => {
        setContents(<HistoryContents items={res.data.result} />);
      });
  };

  const clickMemo = (subMeetingId) => {
    setModalOn(true);
    setHeader("메모");
    axios
      .get(`http://3.39.169.146/memos/memo/${subMeetingId}`, config)
      .then((res) => {
        setContents(<MemoContents item={res.data.result[0]} />);
      });
  };

  useEffect(() => {
    axios
      .get(
        `http://3.39.169.146/meetings/meetingHistory/?meetingId=${meetingId}`,
        config
      )
      .then((res) => {
        setMeetingInfo(res.data.result);
      });
  }, []);

  const closeHandler = () => {
    setModalOn(false);
  };

  return (
    <div className={styles.history}>
      <HistoryTable
        meetingInfo={meetingInfo}
        clickSummary={clickSummary}
        clickMemo={clickMemo}
      />
      {modalOn && (
        <Modal onClose={closeHandler} header={header} contents={contents} />
      )}
    </div>
  );
};

export default HistoryPage;
