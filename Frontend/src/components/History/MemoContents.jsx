import React from "react";
import styles from "./MemoContents.module.css";

const MemoContents = (props) => {
  const { item } = props;
  return (
    <div>
      <div>{item.memo_content}</div>
    </div>
  );
};

export default MemoContents;
