import React from "react";

const MemoContents = (props) => {
  const { item } = props;
  return (
    <>
      <div>
        <h2>{item.topic}</h2>
      </div>
      <div>{item.memo_content}</div>
    </>
  );
};

export default MemoContents;
