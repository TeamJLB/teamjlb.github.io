import { useState } from "react";
import Controlers from "./Controlers";
import Chat from "./Chat";
import styles from "./StreamBox.module.css";

const StreamBox = (props) => {
  const [chatOn, setChatOn] = useState(true);
  return (
    <div className={styles.streamBox}>
      <div className={styles.streams}>
        <div className={`${styles.myStream} ${styles.people1}`}>
          <video autoPlay className={styles.myFace} />
          <h3 className={styles.userNickname} />
        </div>
      </div>
      {chatOn && <Chat />}
      <Controlers setChatOn={setChatOn} />
    </div>
  );
};

export default StreamBox;
