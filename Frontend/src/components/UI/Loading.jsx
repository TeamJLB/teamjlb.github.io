import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingText}>회의 기록 중...</div>
      <img src="img/spinner.gif" />
    </div>
  );
};

export default Loading;
