import React from "react";
import HistoryTd from "./HistoryTd";

const HistoryTable = ({ meetingInfo, clickSummary, clickMemo }) => {
  return (
    <div>
      {console.log(meetingInfo)}
      {/* <h2>회의 히스토리</h2>
      <table>
        <thead>
          <tr>
            <th>개설 날짜</th>
            <th>회의 주제</th>
            <th>참가자</th>
            <th>회의 요약본</th>
            <th>메모</th>
            <th>주요 키워드</th>
          </tr>
        </thead>
        <tbody>
          {meetingInfo &&
            meetingInfo.map((item) => {
              return (
                <HistoryTd
                  key={item.id}
                  id={item.id}
                  item={item}
                  clickSummary={clickSummary}
                  clickMemo={clickMemo}
                />
              );
            })}
        </tbody>
      </table> */}
    </div>
  );
};

export default HistoryTable;
