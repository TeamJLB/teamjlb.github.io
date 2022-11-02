import React from "react";
import styles from "./MemoItem.module.css";

const MemoItem = (props) => {
  const { subMeetingId, memo, onMemoClick } = props;

  const created = memo.createdAt.split("T");
  const date = created[0];

  const memoClickHandler = () => {
    onMemoClick(subMeetingId);
  };

  return (
    <>
      <li className={styles.memoItem} onClick={memoClickHandler}>
        <span className={styles.memoTopic}>{memo.topic}</span>
        <span className={styles.memoDate}>{date}</span>
        <div className={styles.memoContent}>{memo.memo_content}</div>
      </li>
    </>
  );
};

export default MemoItem;
