import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <>
      <div className={styles.loading}>회의 기록 중...</div>
      <img src="img/spinner.gif" />
    </>
  );
};

export default Loading;
