import styles from "./MemoList.module.css";
import React from "react";
import MemoItem from "./MemoItem";
import axios from "axios";
import host_config from "../../../config/serverHost";

const MemoList = (props) => {
  const { setModalOn, memoList, setMemoOn, setMemoItem, config } = props;

  const onClose = () => {
    setModalOn(false);
  };

  const memoClickHandler = (subMeetingId) => {
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/memos/memo/${subMeetingId}`,
        config
      )
      .then((res) => {
        const item = res.data.result[0];
        const created = item.createdAt.split("T");
        const date = created[0];
        setMemoItem({
          date: date,
          topic: item.topic,
          content: item.memo_content,
        });
        setModalOn(false);
        setMemoOn(true);
      });
  };

  const memoListView =
    memoList.length !== 0 ? (
      <ul className={styles.memoList}>
        {memoList.map((memo) => {
          return (
            <MemoItem
              key={memo.memo_id}
              subMeetingId={memo.sub_meeting_id}
              memo={memo}
              onMemoClick={memoClickHandler}
            />
          );
        })}
      </ul>
    ) : (
      <div className={styles.zeroNote}>이전에 작성한 노트가 없어요 😢</div>
    );

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.memoLog}>{memoListView}</div>
    </>
  );
};

export default MemoList;
