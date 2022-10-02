import "./Memo.css";

const Memo = () => {
  return (
    <div className="memo">
      <div className="memoView">
        <div className="memoTitle">
          <h3>Memo</h3>
        </div>
        <div className="memoArea">
          <textarea className="memoText" placeholder="메모 작성" />
        </div>
      </div>
    </div>
  );
};

export default Memo;
