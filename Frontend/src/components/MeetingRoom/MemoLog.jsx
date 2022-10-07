import styles from "./MemoLog.module.css";

const MemoLog = (props) => {
  const { setModalOn } = props;
  const closeHandler = () => {
    setModalOn(false);
  };
  return (
    <div className={styles.memoLog}>
      <div className={styles.memoList}>이전에 작성한 메모 리스트</div>
    </div>
  );
};

export default MemoLog;
