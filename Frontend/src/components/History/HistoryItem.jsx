import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import styles from "./HistoryItem.module.css";
import host_config from "../../config/serverHost";
import MemoContents from "./MemoContents";
import SummaryContents from "./SummaryContents";

const HistoryItem = (props) => {
  const { subMeetingId, date, topic, participants, keywords, config } = props;
  const [memoContent, setMemoContent] = useState(null);
  const [summaryContent, setSummaryContent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/memos/memo/${subMeetingId}`,
        config
      )
      .then((res) => {
        if (res.data.result?.length !== 0) setMemoContent(res.data.result[0]);
      });

    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/summaries/summary/${subMeetingId}`,
        config
      )
      .then((res) => {
        setSummaryContent(res.data.result);
      });
  }, []);

  const clickMemoHandler = () => {
    setIsMemoOpen((prev) => !prev);
  };

  const clickSummaryHandler = () => {
    setIsSummaryOpen((prev) => !prev);
  };

  const openDetailsHandler = () => {
    if (isDetailsOpen === true) {
      setIsMemoOpen(false);
      setIsSummaryOpen(false);
    }
    setIsDetailsOpen((prev) => !prev);
  };

  const memoContents =
    memoContent && memoContent.memo_content !== "" ? (
      <MemoContents item={memoContent} />
    ) : (
      <div style={{ padding: "20px" }}>작성한 노트가 없어요 😢</div>
    );

  const summaryContents =
    summaryContent?.length !== 0 ? (
      <SummaryContents items={summaryContent} />
    ) : (
      <div style={{ padding: "20px" }}>요약본이 기록되지 않았어요 😢</div>
    );

  return (
    <li className={`${styles.historyItem} ${isDetailsOpen && styles.clicked}`}>
      <div
        className={`${styles.historyInfo} ${isDetailsOpen && styles.clicked}`}
        onClick={openDetailsHandler}
      >
        <div className={styles.date}>{date}</div>
        <div className={styles.topic}>{topic}</div>
        <div className={styles.keywords}>
          {keywords.map((keyword) => {
            return (
              <span key={Math.random().toString()} className={styles.keyword}>
                {keyword}
              </span>
            );
          })}
        </div>
      </div>
      {isDetailsOpen && (
        <div className={styles.historyDetails}>
          <div className={styles.participants}>참가자 | {participants}</div>
          <div
            className={`${styles.toggle} ${isMemoOpen && styles.opened}`}
            onClick={clickMemoHandler}
          >
            ✍🏻 NOTE
          </div>
          {isMemoOpen && <>{memoContents}</>}
          <div
            className={`${styles.toggle} ${isSummaryOpen && styles.opened}`}
            onClick={clickSummaryHandler}
          >
            🗒 회의 요약본
          </div>
          {isSummaryOpen && <>{summaryContents}</>}
        </div>
      )}
    </li>
  );
};

export default HistoryItem;
