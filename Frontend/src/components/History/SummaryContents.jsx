import React from "react";

const SummaryContents = (props) => {
  const { items } = props;
  return (
    <div>
      {items.map((item) => (
        <div key={item.match_id}>
          <div>
            <h3>{item.user_name}</h3>
          </div>
          <div>요약 : {item.summary_content}</div>
          <div>원본 : {item.original_content}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryContents;
