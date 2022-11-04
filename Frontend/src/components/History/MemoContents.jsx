import React from "react";
import styles from "./MemoContents.module.css";

const MemoContents = (props) => {
  const { item } = props;
  return <div className={styles.memoContents}>{item.memo_content}</div>;
};

export default MemoContents;
