import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";

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
      <TableRow key={subMeetingId}>
        <TableCell width="50px">{subMeetingId}</TableCell>
        <TableCell width="150px">{date}</TableCell>
        <TableCell width="250px">{topic}</TableCell>
        <TableCell width="150px">{participants}</TableCell>
        <TableCell width="100px">{keywords}</TableCell>
        <TableCell width="131px">
          <Button variant="outlined" onClick={onSummary}>
            회의 요약본
          </Button>
        </TableCell>
        <TableCell width="96px">
          <Button variant="outlined" onClick={onMemo}>
            메모
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default HistoryTd;
