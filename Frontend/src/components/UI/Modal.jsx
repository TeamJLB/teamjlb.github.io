import React from "react";
import { useState } from "react";
import styles from "./Modal.module.css";

const Modal = (props) => {
  const { setModalOn, header, body } = props;

  const closeHandler = () => {
    setModalOn(false);
  };

  return (
    <div className={styles.modal}>
      <section>
        <header>
          {header}
          <button onClick={closeHandler}>닫기</button>
        </header>
        <main>{body}</main>
      </section>
    </div>
  );
};

export default Modal;
