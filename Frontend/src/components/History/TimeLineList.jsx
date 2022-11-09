import React from "react";
import styles from "./TimeLineList.module.css";
import Timeitem from "./Timeitem";
import Timeline from "@mui/lab/Timeline";

const TimeLineList = (props) => {
  const { historyList, config } = props;

  return (
    <div className={styles.timeline}>
      <h2>🗓 TimeLine </h2>
      <Timeline position="alternate" mb={0}>
        {historyList &&
          historyList.map((history) => {
            const created = history.createdAt.split("T");
            const date = created[0];
            const time = created[1].substr(0, 5);
            const people = history.participants;
            let participants = "";
            for (let i = 0; i < people.length; i++) {
              participants += people[i] + " ";
            }
            return (
              <Timeitem
                key={history.sub_meeting_id}
                subMeetingId={history.sub_meeting_id}
                date={date}
                time={time}
                topic={history.topic}
                participants={participants}
                config={config}
              />
            );
          })}
      </Timeline>
    </div>
  );
};

export default TimeLineList;
