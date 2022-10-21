import React from "react";

const HistoryTd = ({
  subMeetingId,
  date,
  topic,
  participants,
  keywords,
  clickSummary,
  clickMemo,
}) => {
  const onSummary = () => {
    clickSummary(subMeetingId);
  };
  const onMemo = () => {
    clickMemo(subMeetingId);
  };

  return (
    <>
      <tr key={subMeetingId}>
        <td>{subMeetingId}</td>
        <td>{date}</td>
        <td>{topic}</td>
        <td>{participants}</td>
        <td>{keywords}</td>
        <td>
          <button onClick={onSummary}>회의 요약본</button>
        </td>
        <td>
          <button onClick={onMemo}>메모</button>
        </td>
      </tr>
    </>
  );
};

export default HistoryTd;
