import React from "react";
import HistoryTd from "./HistoryTd";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { makeStyles } from "@mui/styles";
import styles from "./HistoryTable.module.css";

const useStyles = makeStyles({
  root: {
    minWidth: 650,
  },
});

const HistoryTable = (props) => {
  const { meetingInfo, clickSummary, clickMemo } = props;
  const classes = useStyles();
  return (
    <div className={styles.historyTable}>
      <h2>회의 히스토리</h2>
      <div className={styles.table}>
        <Table className={classes.root} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>생성 날짜</TableCell>
              <TableCell>주제</TableCell>
              <TableCell>참가자</TableCell>
              <TableCell>주요 키워드</TableCell>
              <TableCell align="center">요약 보기</TableCell>
              <TableCell align="center">메모 보기</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meetingInfo &&
              meetingInfo.map((item) => {
                const created = item.createdAt.split("T");
                const date = created[0];
                const time = created[1].substr(0, 5);
                const people = item.participants;
                let participants = "";
                for (let i = 0; i < people.length; i++) {
                  participants += people[i] + " ";
                }
                return (
                  <HistoryTd
                    key={Math.random().toString()}
                    subMeetingId={item.sub_meeting_id}
                    date={date + " " + time}
                    topic={item.topic}
                    participants={participants}
                    keywords={item.keywords}
                    clickSummary={clickSummary}
                    clickMemo={clickMemo}
                  />
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryTable;
