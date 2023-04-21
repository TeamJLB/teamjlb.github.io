import React from "react";
import styles from "./Loading.module.css";
import spinner from "../../assets/spinner.gif";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <img width="5%" src={spinner} />
      <div className={styles.loadingText}>
        회의를 기록 중입니다. 조금만 기다려주세요 :D
      </div>
    </div>
  );
};

export default Loading;
