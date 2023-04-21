import React from "react";
import HistoryItem from "./HistoryItem";
import styles from "./HistoryList.module.css";

const HistoryList = (props) => {
  const { historyList, config } = props;

  return (
    <div className={styles.historyList}>
      <ul className={styles.list}>
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
              <HistoryItem
                key={history.sub_meeting_id + date}
                subMeetingId={history.sub_meeting_id}
                date={date + " " + time}
                topic={history.topic}
                participants={participants}
                config={config}
              />
            );
          })}
      </ul>
    </div>
  );
};

export default HistoryList;
