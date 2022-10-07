import styles from "./Controlers.module.css";

const Controlers = () => {
  return (
    <div className={styles.controlers}>
      <div className={styles.controlers_col}>
        <div className={styles.controlers_col1}>
          <div className={styles.buttons}>
            <button className={styles.muteBtn}>뮤트</button>
            <button className={styles.cameraBtn}>카메라</button>
            <button className={styles.chatBtn}>채팅</button>
            <button className={styles.memoBtn}>메모</button>
          </div>
        </div>
        <div className={styles.controlers_col2}>
          <button className={styles.leave}>회의 나가기</button>
        </div>
      </div>
    </div>
  );
};

export default Controlers;
