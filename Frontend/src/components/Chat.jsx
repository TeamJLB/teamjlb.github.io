import styles from "./Chat.module.css";

const Chat = () => {
  return (
    <div className={styles.chatRoom} hidden>
      <div className="chatView">
        <div>
          <h3>CHAT</h3>
        </div>
        <ul className={styles.chatBox} />
        <form className={styles.chatForm}>
          <input required type="text" placeholder="메세지 입력" />
          <button>전송</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
