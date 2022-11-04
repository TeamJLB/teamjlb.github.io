import React from "react";

const MemoContents = (props) => {
  const { item } = props;
  return (
    <div>
      <h2>{item.topic}</h2>
      <div>{item.memo_content}</div>
    </div>
  );
};

export default MemoContents;
