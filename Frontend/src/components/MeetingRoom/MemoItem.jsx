import React from "react";
import styles from "./MemoItem.module.css";

const MemoItem = (props) => {
  const { subMeetingId, memo, onMemoClick } = props;

  const memoClickHandler = () => {
    onMemoClick(subMeetingId);
  };

  return (
    <>
      <li className={styles.memoItem} onClick={memoClickHandler}>
        <div className={styles.memoTopic}>{memo.topic}</div>
        <div className={styles.memoContent}>{memo.memo_content}</div>
      </li>
    </>
  );
};

export default MemoItem;
