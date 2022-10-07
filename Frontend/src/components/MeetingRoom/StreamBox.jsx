import Controlers from "./Controlers";
import styles from "./StreamBox.module.css";

const StreamBox = () => {
  return (
    <div className={styles.streamBox}>
      <div className={styles.streams}>
        <div className={`${styles.myStream} ${styles.people1}`}>
          <video autoPlay playsInline className={styles.myFace} />
          <h3 className={styles.userNickname} />
        </div>
      </div>
      <Controlers />
    </div>
  );
};

export default StreamBox;
