import styles from "./Memo.module.css";

const Memo = () => {
  return (
    <div className={styles.memo}>
      <div className={styles.memoView}>
        <div className={styles.memoTitle}>
          <h3>Memo</h3>
        </div>
        <div className={styles.memoArea}>
          <textarea className={styles.memoText} placeholder="메모 작성" />
        </div>
      </div>
    </div>
  );
};

export default Memo;
