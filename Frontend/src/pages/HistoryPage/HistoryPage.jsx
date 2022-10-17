import React, { useEffect, useState } from "react";
import axios from "axios";
import HistoryTable from "../../components/History/HistoryTable";
import Modal from "../../components/UI/Modal";

const HistoryPage = () => {
  const [meetingInfo, setMeetingInfo] = useState();
  const [modalOn, setModalOn] = useState(false);
  const [header, setHeader] = useState("");
  const [contents, setContents] = useState("");

  const clickSummary = (id) => {
    setModalOn(true);
    setHeader("회의 요약본");
    setContents("회의 요약본 내용");
  };

  const clickMemo = (id) => {
    setModalOn(true);
    setHeader("메모");
    setContents("메모 내용");
  };

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setMeetingInfo(res.data));
  }, []);

  const closeHandler = () => {
    setModalOn(false);
  };

  return (
    <>
      <HistoryTable
        meetingInfo={meetingInfo}
        clickSummary={clickSummary}
        clickMemo={clickMemo}
      />
      {modalOn && (
        <Modal onClose={closeHandler} header={header} contents={contents} />
      )}
    </>
  );
};

export default HistoryPage;
