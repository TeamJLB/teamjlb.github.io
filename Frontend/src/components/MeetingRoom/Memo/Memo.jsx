import React, { memo, useEffect, useState } from "react";
import MemoList from "./MemoList";
import styles from "./Memo.module.css";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import axios from "axios";
import host_config from "../../../config/serverHost";

const Memo = React.forwardRef((props, ref) => {
  const { config, meetingId } = props;

  const [modalOn, setModalOn] = useState(false);
  const [memoList, setMemoList] = useState([]);
  const [memoOn, setMemoOn] = useState(false);
  const [memoItem, setMemoItem] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/memos/memoList/${meetingId}`,
        config
      )
      .then((res) => {
        setMemoList(res.data.result);
      });
  }, []);

  const clickLogHandler = () => {
    setModalOn((prev) => !prev);
  };

  const memoCloseHandler = () => {
    setMemoOn(false);
  };

  return (
    <div className={styles.memoView}>
      <div className={styles.memoTitle}>
        <button
          className={`${styles.memoListBtn} ${modalOn && styles.clicked}`}
          onClick={clickLogHandler}
        >
          NOTE
        </button>
        {modalOn && (
          <MemoList
            memoList={memoList}
            setModalOn={setModalOn}
            setMemoOn={setMemoOn}
            setMemoItem={setMemoItem}
            config={config}
          />
        )}
      </div>
      {memoOn && memoItem && (
        <div className={styles.selectedMemo}>
          <span className={styles.memoTopic}>{memoItem.topic}</span>
          <span className={styles.memoDate}>{memoItem.date}에 작성됨</span>
          <button className={styles.closeBtn} onClick={memoCloseHandler}>
            <img width="15px" height="15px" src="img/close.png"></img>
          </button>
          <div className={styles.memoContent}>{memoItem.content}</div>
        </div>
      )}
      <div className={styles.memoArea}>
        <Editor
          toolbarItems={[
            ["heading", "bold", "italic", "strike"],
            ["hr", "quote"],
            ["ul", "ol", "task", "indent", "outdent"],
            ["table", "code", "codeblock"],
          ]}
          placeholder="이곳에 기록하세요!"
          previewStyle="vertical"
          height="100%"
          initialEditType="wysiwyg"
          spellcheck="false"
          ref={ref}
        />
      </div>
    </div>
  );
});

export default memo(Memo);
