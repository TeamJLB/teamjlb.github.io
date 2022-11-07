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
  const [info, setInfo] = useState([]); // meetingList에 보여지는 카드 정보
  const [searchByID, setSearchByID] = useState(""); // ID로 회의 검색
  const [searchBySTR, setSearchBySTR] = useState(""); // 내 회의 검색
  const [modalOn, setModalOn] = useState(false); // 새 회의 추가 모달
  const [searchFlag, setSearchFlag] = useState(false); // 외부 카드 (false -> 외부 회의)
  const [subId, setSubId] = useState("");
  const [matchId, setMatchId] = useState("");
  const [currentMeetingId, setCurrentMeetingId] = useState("");

  const config = {
    headers: {
      "x-access-token": USER_TOKEN,
    },
  };

  useEffect(() => {
    loadList();
    console.log(config);
  }, []);

  // user 회의 리스트 불러오기
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

  // [MeetingBlock Handling]
  // 회의 카드에 존재하는 버튼 핸들링

  // [MeetingBlock Handling] - 히스토리 입장
  const handleEnterHistory = (meetingid, meetingName) => {
    navigate("/history", {
      state: {
        userToken: USER_TOKEN,
        meeting_id: meetingid,
        meeting_name: meetingName,
      },
    });
  };

  // [MeetingBlock Handling] - [참가] 화상회의실 입장
  const handleEnterMeeting = (meetingID) => {
    setCurrentMeetingId(meetingID);
    axios
      .post(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/openMeeting/${meetingID}`,
        "",
        config
      )
      .then((res) => {
        console.log(res);
        if (res.data.isSuccess) {
          if (res.data.result.action === "회의를 개설합니다.") {
            setSubId(res.data.result.added_subMeeting_id);
            setMatchId(res.data.result.added_match_id);
          } else if (res.data.result.action === "회의에 참가합니다.") {
            setSubId(res.data.result.opened_subMeeting_id);
            setMatchId(res.data.result.added_match_id);
          } else if (res.data.result.action === "회의에 재입장합니다.") {
            setSubId(res.data.result.opened_subMeeting_id);
            setMatchId(res.data.result.updated_match_id);
          }
        } else {
          alert(res.data.message);
        }
      });
  };

  useEffect(() => {
    console.log(subId, matchId);
    if (subId && matchId) {
      console.log("subid : ", subId, "matchid :", matchId);
      navigate("/meetingRoom", {
        state: {
          config: config,
          meeting_id: currentMeetingId,
          subMeeting_id: subId,
          match_id: matchId,
        },
      });
    }
  }, [subId, matchId, navigate]);

  // [MeetingBlock Handling] - 회의 삭제
  const handleRemove = (id) => {
    console.log("remove", id);
    axios
      .delete(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/myMeeting/${id}`,
        config
      )
      .then((res) => {
        console.log(res);
        if (res.data.isSuccess) {


          console.log(res);
          loadList();
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => alert(err));
  };

  // [MeetingBlock Handling] - ID로 회의 검색 -> 취소 버튼
  const cancelSearch = () => {
    setSearchFlag(false);
    setSearchByID("");
    loadList();
  };

  // [MeetingBlock Handling] - ID로 회의 검색 -> 내 회의 추가 버튼
  const AddMeetingByID = (meetingID) => {
    //id로 회의 추가
    axios
      .post(
        `http://${host_config.current_host}:${host_config.current_port}/meetings/myMeeting/${meetingID}`,
        "",
        config
      )
      .then((res) => {
        if (res.data.isSuccess) {
          setSearchByID("");
          setSearchFlag(false);
          alert("✅ 회의 추가가 완료되었습니다.");
          loadList();
        } else {
          alert(res.data.message);
        }
      });
  };

  // ID로 회의 검색
  const searchMeetingByID = () => {
    if (searchByID === "") {
      setSearchFlag(false);
      loadList();
    } else {
      axios
        .get(
          `http://${host_config.current_host}:${host_config.current_port}/meetings/search/${searchByID}`,
          config
        )
        .then((res) => {
          if (res.data.isSuccess) {
            setInfo(res.data.result);
            setSearchFlag(true);
          } else {
            alert(res.data.message);
          }
        });
    }
  };

  // 내 회의 검색
  const searchMeeting = () => {
    if (searchBySTR === "") {
      setSearchByID("");
      setSearchFlag(false);
      loadList();
    } else {
      axios
        .get(
          `http://${host_config.current_host}:${host_config.current_port}/meetings/myMeeting/`,
          {
            params: { search: searchBySTR },
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
          setSearchBySTR("");
        });
    }
  };

  // 새 회의 추가
  const handleAddMeeting = () => {
    console.log("click");
    setModalOn(true);
  };

  // 새 회의 추가 모달 -> 취소 버튼
  const handleAddCancel = () => {
    setModalOn(false);
  };

  // 새 회의 추가 모달 -> 추가 버튼
  const handleAddSubmit = (meetingName) => {
    setModalOn(false);
    console.log("회의 명 : ", meetingName);
    axios
        .post(
            `http://${host_config.current_host}:${host_config.current_port}/meetings/newMeeting`,
            {
              meeting_name: meetingName
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

  return (
    <div className={style.body}>
      <div className={style.content}>
        <h1 className={style.listTitle}>🖥 MY MEETING LIST</h1>
        <div className={style.searchGroup}>
          <div className={style.searchbar}>
            내 회의 검색
            <input
              type="text"
              value={searchBySTR}
              className={style.searchMeeting}
              onChange={(e) => setSearchBySTR(e.target.value)}
            />
            <button className={style.searchBtn} onClick={searchMeeting}>
              검색
            </button>
          </div>
          <div className={style.searchbar}>
            ID로 회의 검색
            <input
              id="inputMeetingID"
              className={style.searchMeeting}
              type="text"
              value={searchByID}
              onChange={(e) => setSearchByID(e.target.value)}
            />
            <button className={style.searchBtn} onClick={searchMeetingByID}>
              검색
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
              searchFlag={searchFlag}
              cancelSearch={cancelSearch}
              AddMeetingByID={AddMeetingByID}
            />
            <Card elevation={3} className={style.hvrBounceIn}>
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
