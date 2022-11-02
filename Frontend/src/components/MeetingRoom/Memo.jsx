import { useEffect, useState } from "react";
import MemoList from "./MemoList";
import styles from "./Memo.module.css";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import axios from "axios";
import host_config from "../../config/serverHost";

const Memo = () => {
  const location = useLocation();
  const config = location.state.config;
  const meetingId = location.state.meeting_id;

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

  return (
    <div className={styles.memoView}>
      <div className={styles.memoTitle}>
        <Button
          sx={{ color: "black" }}
          variant="outlined"
          onClick={clickLogHandler}
        >
          NOTE LIST
        </Button>
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
          <div>{memoItem.date}</div>
          <div>{memoItem.topic}</div>
          <div>{memoItem.content}</div>
        </div>
      )}
      <div className={styles.memoArea}>
        <textarea
          spellCheck="false"
          className={styles.memoText}
          placeholder="이곳에 기록하세요!"
        />
      </div>
    </div>
  );
};

export default Memo;
