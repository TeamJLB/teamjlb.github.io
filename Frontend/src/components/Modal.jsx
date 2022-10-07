import React from "react";
import styles from "./Modal.module.css";

const Modal = (props) => {
  const { isOpen, close, header, body } = props;

  return (
    <div className={`${styles.modal} ${isOpen && styles.opened}`}>
      {isOpen ? (
        <section>
          <header>
            {header}
            <button onClick={close}>닫기</button>
          </header>
          <main>{body}</main>
        </section>
      ) : null}
    </div>
  );
};

export default Modal;
