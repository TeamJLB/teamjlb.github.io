import React, { useState } from "react";
import styles from "./OriginalContent.module.css";

const OriginalContent = (props) => {
  const { item } = props;
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);

  const clickOriginalSttHandler = () => {
    setIsOriginalOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={`${styles.originalTitle} ${styles.closed}`}
        onClick={clickOriginalSttHandler}
      >
        {isOriginalOpen ? "원본 숨기기" : "원본 보기"}
      </div>
      {isOriginalOpen && (
        <div
          className={styles.originalContent}
          style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
        >
          {item.original_content ? item.original_content : "(내용 없음)"}
        </div>
      )}
    </>
  );
};

export default OriginalContent;
