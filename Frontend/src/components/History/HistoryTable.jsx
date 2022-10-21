import React from "react";
import HistoryTd from "./HistoryTd";

const HistoryTable = (props) => {
  const { meetingInfo, clickSummary, clickMemo } = props;
  return (
    <div>
      <h2>회의 히스토리</h2>
      <table>
        <thead>
          <tr>
            <th>회의 번호</th>
            <th>생성 날짜</th>
            <th>주제</th>
            <th>참가자</th>
            <th>주요 키워드</th>
            <th>요약 보기</th>
            <th>메모 보기</th>
          </tr>
        </thead>
        <tbody>
          {meetingInfo &&
            meetingInfo.map((item) => {
              return (
                <HistoryTd
                  key={Math.random().toString()}
                  subMeetingId={item.sub_meeting_id}
                  date={item.createdAt}
                  topic={item.topic}
                  participants={item.participants}
                  keywords={item.keywords}
                  clickSummary={clickSummary}
                  clickMemo={clickMemo}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
