import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import style from "./MeetingBlock.module.css";
import { CardActions } from "@mui/material";

const MeetingBlock = ({
  item,
  handleEnterHistory,
  handleEnterMeeting,
  handleRemove,
  searchFlag,
  cancelSearch,
  AddMeetingByID,
}) => {
  const [searchStatus, setsearchStatus] = useState(searchFlag);
  const onRemove = () => {
    handleRemove(item.meeting_id);
  };
  const onEnterHistory = () => {
    handleEnterHistory(item.meeting_id, item.meeting_name);
  };
  const onEnterMeeting = () => {
    handleEnterMeeting(item.meeting_id);
  };
  const onAddMeeting = () => {
    setsearchStatus(false);
    AddMeetingByID(item.meeting_id);
  };
  const oncancel = () => {
    cancelSearch();
    setsearchStatus(false);
  };
  return (
    <>
      {searchStatus ? (
        <Card className={style.hvrBounceIn} elevation={3} sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography variant="subtitle1">{item.meeting_id}</Typography>
            <Typography variant="h6" component="div">
              {item.meeting_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.createdAt.split("T")[0]}
            </Typography>
          </CardContent>
          <div className={style.meetingBlock_buttons}>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              size="small"
              onClick={oncancel}
            >
              취소
            </Button>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              color="success"
              size="small"
              onClick={onAddMeeting}
            >
              내 회의에 추가
            </Button>
          </div>
        </Card>
      ) : (
        <Card className={style.hvrBounceIn} elevation={3} sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography variant="subtitle1">{item.meeting_id}</Typography>
            <Typography variant="h6" component="div">
              {item.meeting_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.createdAt.split("T")[0]}
            </Typography>
          </CardContent>
          <div className={style.meetingBlock_buttons}>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              size="small"
              onClick={onEnterHistory}
            >
              회의 히스토리
            </Button>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              color="success"
              size="small"
              onClick={onEnterMeeting}
            >
              참가
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onRemove}
            >
              삭제
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default MeetingBlock;
