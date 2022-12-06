import React from "react";
import styles from "./Loading.module.css";
import spinner from "../../assets/spinner.gif";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingText}>회의 기록 중...</div>
      <img width="5%" src={spinner} />
    </div>
  );
};

export default Loading;
