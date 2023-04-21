import React, { memo } from "react";
import styles from "./MemoContents.module.css";
import ReactQuill from "react-quill";

const MemoContents = (props) => {
  const { item } = props;
  return (
    <ReactQuill value={item.memo_content} readOnly="true" theme="bubble" />
  );
};

export default MemoContents;
