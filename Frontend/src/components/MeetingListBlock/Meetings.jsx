import React from "react";
import MeetingBlock from "./MeetingBlock";

const Meetings = ({
  info,
  handleEnterHistory,
  handleEnterMeeting,
  handleRemove, searchFlag, cancelSearch ,AddMeetingByID
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
            searchFlag={searchFlag}
            cancelSearch={cancelSearch}
            AddMeetingByID={AddMeetingByID}
          />
        );
      })}
    </>
  );
};

export default Meetings;
