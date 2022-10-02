import "./Controlers.css";

const Controlers = () => {
  return (
    <div className="controlers">
      <div className="controlers_col">
        <div className="controlers_col1">
          <div className="buttons">
            <button className="muteBtn">뮤트</button>
            <button className="cameraBtn">카메라</button>
            <button className="chatBtn">채팅</button>
            <button className="memoBtn">메모</button>
          </div>
        </div>
        <div className="controlers_col2">
          <button className="leave">회의 나가기</button>
        </div>
      </div>
    </div>
  );
};

export default Controlers;
