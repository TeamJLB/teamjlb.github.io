import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HistoryList from "../../components/History/HistoryList";
import styles from "./HistoryPage.module.css";
import host_config from "../../config/serverHost";
import TimeLineList from "../../components/History/TimeLineList";

const HistoryPage = () => {
  const location = useLocation();
  const USER_TOKEN = location.state.userToken;
  const config = {
    headers: {
      "x-access-token": USER_TOKEN,
    },
  };
  const meetingId = location.state.meeting_id;
  const meetingName = location.state.meeting_name;

  const [historyList, sethistoryList] = useState();

  useEffect(() => {
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/meetingHistory/?meetingId=${meetingId}`,
        config
      )
      .then((res) => {
        sethistoryList(res.data.result);
      });
  }, [location.state]);

  return (
    <>
      <div className={styles.history}>
        <div className={styles.historyTitle}>
          <h1> 🔍 HISTORY : {meetingName} </h1>
        </div>
        <HistoryList historyList={historyList} config={config} />
      </div>
      <TimeLineList historyList={historyList} config={config} />
    </>
  );
};

export default HistoryPage;
