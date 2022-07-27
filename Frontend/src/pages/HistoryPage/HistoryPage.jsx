import React, { useEffect, useState } from "react";
import axios from "axios";
import HistoryTable from "../../components/HistoryTable";
import SummaryModal from "../../components/SummaryModal";

const HistoryPage = () => {
  const [meetingInfo, setMeetingInfo] = useState();
  const [modalOn, setModalOn] = useState(false);

  const clickSummary = (id) => {
    console.log(`아이디 ${id}의 회의 요약본`);
  };

  const clickMemo = (id) => {
    console.log(`아이디 ${id}의 회의 메모`);
  };

  const clickModal = () => {
    setModalOn(true);
  };
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setMeetingInfo(res.data));
  }, []);

  return (
    <>
      <HistoryTable
        meetingInfo={meetingInfo}
        clickSummary={clickSummary}
        clickMemo={clickMemo}
      />
      {/* <button onClick={clickModal}>모달</button>
      {modalOn && <SummaryModal />} */}
    </>
  );
};

export default HistoryPage;
