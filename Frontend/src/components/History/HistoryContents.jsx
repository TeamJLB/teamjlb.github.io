import React from "react";

const HistoryContents = (props) => {
  const { items } = props;
  console.log(items);
  return (
    <>
      {items.map((item) => (
        <div key={item.match_id}>
          <div>
            <h3>{item.user_name}</h3>
          </div>
          <div>요약 : {item.summary_content}</div>
          <div>원본 : {item.original_content}</div>
        </div>
      ))}
    </>
  );
};

export default HistoryContents;
