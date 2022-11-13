import React, { useState, useEffect } from "react";
import style from "./Meeting.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { grey } from "@mui/material/colors";
import { Typography } from "@mui/material";

const NewMeetingModal = ({ handleAddCancel, handleAddSubmit }) => {
  const [todayYear, setTodayYear] = useState();
  const [todayMonth, setTodayMonth] = useState();
  const [todayDay, setTodayDay] = useState();
  const [dayOfWeek, setDayOfWeek] = useState();
  const [meetingName, setMeetingName] = useState("");

  useEffect(() => {
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const now = new Date();
    setTodayYear(now.getFullYear());
    setTodayMonth(now.getMonth() + 1);
    setTodayDay(now.getDate());
    setDayOfWeek(week[now.getDay()]);
  }, []);

  const onCancel = () => {
    handleAddCancel();
  };

  const onAddSubmit = (e) => {
    e.preventDefault();
    handleAddSubmit(meetingName);
  };
  return (
    <>
      <div className={style.modalBG}>
        <Box className={style.modalcover}>
          <div className={style.modalclose}>
            <img
              id={style.closeimg}
              onClick={onCancel}
              width="20px"
              height="20px"
              src={"img/close.png"}
            />
          </div>
          <Box mt={2}>
            <h2>➕ 새 회의 개설</h2>
          </Box>
          <div className={style.meetingInfo}>
            <Box mt={2}>
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={1} mr={4}>
                  <h3>개설 날짜</h3>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={7}
                  justifyContent="center"
                  alignItems="center"
                >
                  <div
                    className={style.date}
                  >{`  ${todayYear}년 ${todayMonth}월 ${todayDay}일 (${dayOfWeek})`}</div>
                </Grid>
              </Grid>
            </Box>
            <Box mt={2}>
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={2} mr={4}>
                  <h3>🗒 회의명</h3>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="meetingName"
                    fullWidth
                    value={meetingName}
                    label="회의명"
                    onChange={(e) => setMeetingName(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </div>
          <Box mt={2}>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              size="small"
              onClick={onCancel}
            >
              취소
            </Button>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              color="success"
              size="small"
              onClick={onAddSubmit}
            >
              추가
            </Button>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default NewMeetingModal;
