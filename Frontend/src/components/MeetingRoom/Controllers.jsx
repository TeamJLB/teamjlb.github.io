import Button from "@mui/material/Button";
import styles from "./Controllers.module.css";

const controllers = (props) => {
  const {
    mute,
    cameraOn,
    sttOn,
    onMuteClick,
    onCameraClick,
    onLeaveClick,
    setSttOn,
  } = props;

  const onSttClick = () => {
    setSttOn((prev) => !prev);
  };

  return (
    <div className={styles.controllers}>
      <div className={styles.controllers_col}>
        <div className={styles.controllers_col1}>
          <div className={styles.buttons}>
            <Button
              sx={{ color: "black" }}
              className={styles.muteBtn}
              onClick={onMuteClick}
            >
              {mute ? "마이크 켜기" : "마이크 끄기"}
            </Button>
            <Button
              sx={{ color: "black" }}
              className={styles.cameraBtn}
              onClick={onCameraClick}
            >
              {cameraOn ? "카메라 끄기" : "카메라 켜기"}
            </Button>
            <Button
              sx={{ color: "black" }}
              className={styles.cameraBtn}
              onClick={onSttClick}
            >
              {sttOn ? "자막 끄기" : "자막 켜기"}
            </Button>
          </div>
        </div>
        <div className={styles.controllers_col2}>
          <Button
            variant="outlined"
            onClick={onLeaveClick}
            className={styles.leave}
          >
            회의 나가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default controllers;
