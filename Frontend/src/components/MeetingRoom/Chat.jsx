import styles from "./Chat.module.css";

const Chat = () => {
  return (
    <div className={styles.chatRoom}>
      <ul className={styles.chatBox} />
      <form className={styles.chatForm}>
        <input required type="text" placeholder="메세지 입력" />
        <button>전송</button>
      </form>
    </div>
  );
};

export default Chat;
