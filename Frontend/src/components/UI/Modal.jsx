import React from "react";
import Button from "./Button";
import Card from "./Card";
import styles from "./Modal.module.css";

const Modal = (props) => {
  const { onClose, header, contents } = props;
  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <Card className={styles.modal}>
        <header className={styles.header}>{header}</header>
        <div className={styles.content}>{contents}</div>
        <footer className={styles.actions}>
          <Button onClick={onClose}>닫기</Button>
        </footer>
      </Card>
    </>
  );
};

export default Modal;
