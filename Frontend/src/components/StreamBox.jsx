import Controlers from "./Controlers";
import "./StreamBox.css";

const StreamBox = () => {
  return (
    <div className="streamBox">
      <div className="streams">
        <div className="people1 myStream">
          <video autoPlay playsInline className="myFace" />
          <h3 className="userNickname" />
        </div>
      </div>
      <Controlers />
    </div>
  );
};

export default StreamBox;
