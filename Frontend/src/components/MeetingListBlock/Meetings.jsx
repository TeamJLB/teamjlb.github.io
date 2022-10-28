import React from "react";
import MeetingBlock from "./MeetingBlock";

const Meetings = ({
  info,
  handleEnterHistory,
  handleEnterMeeting,
  handleRemove,
}) => {
  return (
    <>
      {info?.map((item) => {
        return (
          <MeetingBlock
            key={item.meeting_id}
            item={item}
            handleEnterHistory={handleEnterHistory}
            handleEnterMeeting={handleEnterMeeting}
            handleRemove={handleRemove}
          />
        );
      })}
    </>
  );
};

export default Meetings;
