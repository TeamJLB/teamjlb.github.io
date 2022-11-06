import React from "react";
import styles from "./Sidebar.module.css";
import Avatar from "@mui/material/Avatar";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import host_config from "../../config/serverHost";
import axios from "axios";
import { useState } from "react";

const Sidebar = (props) => {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const USER_TOKEN = location.state?.userToken;
  const config = {
    headers: {
      "x-access-token": USER_TOKEN,
    },
  };

  useEffect(() => {
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/users/userInfo`,
        config
      )
      .then((res) => {
        setUserName(res.data.result.user_name);
        setUserEmail(res.data.result.email);
      });
  }, []);

  if (location.pathname === "/") return null;
  if (location.pathname === "/login") return null;
  if (location.pathname === "/meetingRoom") return null;

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
