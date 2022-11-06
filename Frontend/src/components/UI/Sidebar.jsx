import React from "react";
import styles from "./Sidebar.module.css";
import Avatar from "@mui/material/Avatar";

const Sidebar = (props) => {
  if (window.location.pathname === "/meetingRoom") return null;
  // 나중에 추가할 것 : 유저 정보 가져오기
  const userName = "김민지";
  const userEmail = "minji@gmail.com";

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>밋로그</div>
      <div className={styles.userProfile}>
        <Avatar
          sx={{ width: "70px", height: "70px", margin: "auto", mb: "10px" }}
        >
          {userName[0]}
        </Avatar>
        <div className={styles.userName}>{userName}</div>
        <div className={styles.userEmail}>{userEmail}</div>
      </div>
      <div className={styles.meetingList}>
        <ul>
          <li>졸업프로젝트</li>
          <li>자바스크립트 스터디</li>
          <li>코딩테스트 스터디</li>
          <li>CS 스터디</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
