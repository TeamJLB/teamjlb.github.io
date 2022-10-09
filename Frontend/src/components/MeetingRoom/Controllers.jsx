import styles from "./Controllers.module.css";

const controllers = (props) => {
  const { onSoundClick, onCameraClick, setChatOn } = props;

  const chatHandler = () => {
    setChatOn((prev) => !prev);
  };

  const soundHandler = () => {
    onSoundClick();
  };

  const cameraHandler = () => {
    onCameraClick();
  };

  return (
    <div className={styles.controllers}>
      <div className={styles.controllers_col}>
        <div className={styles.controllers_col1}>
          <div className={styles.buttons}>
            <button className={styles.muteBtn} onClick={soundHandler}>
              마이크
            </button>
            <button className={styles.cameraBtn} onClick={cameraHandler}>
              카메라
            </button>
            <button className={styles.chatBtn} onClick={chatHandler}>
              채팅
            </button>
          </div>
        </div>
        <div className={styles.controllers_col2}>
          <button className={styles.leave}>회의 나가기</button>
        </div>
      </div>
    </div>
  );
};

export default controllers;
