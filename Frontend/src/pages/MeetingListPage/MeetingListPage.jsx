import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Meetings from "../../components/MeetingListBlock/Meetings";
import NewMeeingModal from "../../components/MeetingListBlock/NewMeetingModal";
import style from "./MeetingListPage.module.css";
import { useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import host_config from "../../config/serverHost";

const MeetingListPage = () => {
  const location = useLocation();
  const USER_TOKEN = location.state.userToken;
  const navigate = useNavigate();
  const [info, setInfo] = useState([]);
  const [enterID, setEnterID] = useState("");
  const [searchID, setSearchID] = useState("");
  const [modalOn, setModalOn] = useState(false);
  const config = {
    headers: {
      "x-access-token": USER_TOKEN,
    },
  };
  useEffect(() => {
    loadList();
    console.log(config);
  }, []);

  const loadList = () => {
    axios
      .get(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/allList`,
        config
      )
      .then((res) => {
        if (res.data.isSuccess) {
          setInfo(res.data.result);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => alert(err));
  };

  const handleEnterHistory = (meetingid) => {
    navigate("/history", { state: { config: config, meeting_id: meetingid } });
  };
  const handleEnterMeeting = (meetingID) => {
    navigate("/meetingRoom", {
      state: { config: config, meeting_id: meetingID },
    });
  };
  const handleRemove = (id) => {
    axios
      .delete(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/myMeeting/${id}`,
        config
      )
      .then((res) => {
        console.log(res);
        if (res.data.isSuccess) {
          loadList();
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => alert(err));
  };
  const handleAddMeeting = () => {
    console.log("click");
    setModalOn(true);
  };
  const handleAddCancel = () => {
    setModalOn(false);
  };
  const handleAddSubmit = (meetingName, topic) => {
    setModalOn(false);
    console.log("회의 명 : ", meetingName);
    console.log("주제: ", topic);
    axios
      .post(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/newMeeting`,
        {
          meeting_name: meetingName,
          topic: topic,
        },
        config
      )
      .then((res) => {
        if (res.data.isSuccess) {
          loadList();
        } else {
          alert(res.data.message);
        }
      });
  };

  const enterMeeting = () => {
    axios
      .post(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/newMeeting/${enterID}`,
        "",
        config
      )
      .then((res) => {
        if (res.data.isSuccess) {
          handleEnterMeeting(enterID);
        } else {
          alert(res.data.message);
        }
      });
  };

  const searchMeeting = () => {
    if (searchID === "") {
      loadList();
    } else {
      axios
        .get(
          `http://${host_config.current_host}:${host_config.current_port}/meetings/myMeeting`,
          {
            params: { meetingId: searchID },
            headers: {
              "x-access-token": USER_TOKEN,
            },
          }
        )
        .then((res) => {
          if (res.data.isSuccess) {
            setInfo(res.data.result);
          } else {
            alert(res.data.message);
          }
          setSearchID("");
        });
    }
  };

  return (
    <div className={style.body}>
      <div className={style.content}>
        <h1 className={style.listTitle}>🖥 MY MEETING LIST</h1>
        <div className={style.searchGroup}>
          <div className={style.searchbar}>
            내 회의 검색
            <input
              type="text"
              value={searchID}
              className={style.searchMeeting}
              onChange={(e) => setSearchID(e.target.value)}
            />
            <button className={style.searchBtn} onClick={searchMeeting}>
              검색
            </button>
          </div>
          <div className={style.searchbar}>
            ID로 입장
            <input
              id="inputMeetingID"
              className={style.searchMeeting}
              type="text"
              onChange={(e) => setEnterID(e.target.value)}
            />
            <button className={style.searchBtn} onClick={enterMeeting}>
              입장
            </button>
          </div>
        </div>
        <div className={style.gridscroll}>
          <div className={style.grid}>
            <Meetings
              info={info}
              handleEnterHistory={handleEnterHistory}
              handleEnterMeeting={handleEnterMeeting}
              handleRemove={handleRemove}
            />
            <Card elevation={3}>
              <Button
                variant="text"
                sx={{ pt: 8, pb: 8, pl: 13.5, pr: 13.5 }}
                onClick={handleAddMeeting}
              >
                ➕ 회의 만들기
              </Button>
            </Card>
          </div>
          {modalOn && (
            <NewMeeingModal
              handleAddCancel={handleAddCancel}
              handleAddSubmit={handleAddSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingListPage;
