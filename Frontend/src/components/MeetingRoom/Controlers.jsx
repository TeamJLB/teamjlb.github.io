import styles from "./Controlers.module.css";

const Controlers = (props) => {
  const { setChatOn } = props;

  const chatHandler = () => {
    setChatOn((prev) => !prev);
  };

  return (
    <div className={styles.controlers}>
      <div className={styles.controlers_col}>
        <div className={styles.controlers_col1}>
          <div className={styles.buttons}>
            <button className={styles.muteBtn}>마이크</button>
            <button className={styles.cameraBtn}>카메라</button>
            <button className={styles.chatBtn} onClick={chatHandler}>
              채팅
            </button>
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
