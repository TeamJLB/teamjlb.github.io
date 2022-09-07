import React from "react";
import "./Modal.css";

const Modal = (props) => {
  const { isOpen, close, header, body } = props;

  return (
    <div className={isOpen ? "opened modal" : "modal"}>
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
