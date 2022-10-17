import styles from "./Controllers.module.css";

const controllers = (props) => {
  const { mute, cameraOn, onMuteClick, onCameraClick } = props;

  return (
    <div className={styles.controllers}>
      <div className={styles.controllers_col}>
        <div className={styles.controllers_col1}>
          <div className={styles.buttons}>
            <button className={styles.muteBtn} onClick={onMuteClick}>
              {mute ? "마이크 켜기" : "마이크 끄기"}
            </button>
            <button className={styles.cameraBtn} onClick={onCameraClick}>
              {cameraOn ? "카메라 끄기" : "카메라 켜기"}
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
