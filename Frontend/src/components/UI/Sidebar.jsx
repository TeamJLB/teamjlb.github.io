import React from "react";
import styles from "./Sidebar.module.css";
import Avatar from "@mui/material/Avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import host_config from "../../config/serverHost";
import axios from "axios";
import { useState } from "react";
import LogoutBtn from "./LogoutBtn";

const Sidebar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMeetingList, setUserMeetingList] = useState([]);

  let userToken;
  userToken = location.state?.userToken;
  const config = {
    headers: {
      "x-access-token": userToken,
    },
  };

  useEffect(() => {
    if (!userToken) return;
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/users/userInfo`,
        config
      )
      .then((res) => {
        setUserName(res.data.result.user_name);
        setUserEmail(res.data.result.email);
      });
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/allList`,
        config
      )
      .then((res) => {
        setUserMeetingList(res.data.result);
      });
  }, [userToken]);

  if (location.pathname === "/") return null;
  if (location.pathname === "/login") return null;
  if (location.pathname === "/register") return null;
  if (location.pathname.includes("/meetingRoom")) return null;

  const clickLogoHandler = () => {
    // 추후 수정할 부분 (새로고침 하지 않고 리렌더링하도록)
    if (location.pathname === "/meetingList") window.location.reload();
    navigate("/meetingList", { state: { userToken } });
  };

  const clickMeetingHandler = (event) => {
    navigate("/history", {
      state: {
        userToken: userToken,
        meeting_id: event.target.id,
        meeting_name: event.target.innerText,
      },
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo} onClick={clickLogoHandler}>
        <img width="200px" alt="MEETLOG" src="img/logo.png" />
      </div>
      <div className={styles.userProfile}>
        <Avatar
          sx={{ width: "70px", height: "70px", margin: "auto", mb: "10px" }}
        >
          {userName[0]}
        </Avatar>
        <div className={styles.userName}>{userName}</div>
        <div className={styles.userEmail}>{userEmail}</div>
        <div>
          <LogoutBtn />
        </div>
      </div>
      <div className={styles.menu}>
        <ul>
          <li className={styles.menuTitle}>🖥 MY MEETING LIST</li>
          <ul className={styles.menuContent}>
            {userMeetingList.map((meeting) => {
              return (
                <li
                  className={styles.meeting}
                  id={meeting.meeting_id}
                  key={meeting.meeting_id}
                  onClick={clickMeetingHandler}
                >
                  {meeting.meeting_name}
                </li>
              );
            })}
          </ul>
        </ul>
      </div>
      <div className={styles.myPage}>마이페이지</div>
    </div>
  );
};

export default Sidebar;
