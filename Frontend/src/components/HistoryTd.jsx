import React from "react";

const HistoryTd = ({ id, item, clickSummary, clickMemo }) => {
  const onSummary = () => {
    clickSummary(id);
  };
  const onMemo = () => {
    clickMemo(id);
  };

  return (
    <>
      <tr key={id}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>
          <button onClick={onSummary}>회의 요약본</button>
        </td>
        <td>
          <button onClick={onMemo}>메모</button>
        </td>
        <td>{item.username}</td>
      </tr>
    </>
  );
};

export default HistoryTd;
