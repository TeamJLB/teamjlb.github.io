import { useState } from "react";
import MemoLog from "./MemoLog";
import styles from "./Memo.module.css";

const Memo = () => {
  const [modalOn, setModalOn] = useState(false);

  const clickLogHandler = () => {
    setModalOn((prev) => !prev);
  };

  return (
    <div className={styles.memo}>
      <div className={styles.memoView}>
        <div className={styles.memoTitle}>
          <div>Memo</div>
          <button
            type="button"
            onClick={clickLogHandler}
            className={styles.logBtn}
          >
            Memo Log
          </button>
          {modalOn && <MemoLog setModalOn={setModalOn} />}
        </div>
        <div className={styles.memoArea}>
          <textarea className={styles.memoText} placeholder="메모 작성" />
        </div>
      </div>
    </div>
  );
};

export default Memo;
