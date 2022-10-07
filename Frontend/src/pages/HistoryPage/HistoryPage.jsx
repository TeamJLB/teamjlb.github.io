import React, { useEffect, useState } from "react";
import axios from "axios";
import HistoryTable from "../../components/History/HistoryTable";
import Modal from "../../components/Modal";

const HistoryPage = () => {
  const [meetingInfo, setMeetingInfo] = useState();
  const [modalOn, setModalOn] = useState(false);

  const clickSummary = (id) => {
    setModalOn(true);
    console.log(`아이디 ${id}의 회의 요약본`);
  };

  const clickMemo = (id) => {
    setModalOn(true);
    console.log(`아이디 ${id}의 회의 메모`);
  };

  const closeModal = () => {
    setModalOn(false);
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
      <Modal
        isOpen={modalOn}
        close={closeModal}
        header="모달 테스트"
        body="모달 테스트"
      />
    </>
  );
};

export default HistoryPage;
