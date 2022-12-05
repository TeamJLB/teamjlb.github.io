import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import styles from "./SummaryContents.module.css";

const SummaryContents = (props) => {
  const { items } = props;

  const makeSummaryContent = (summary) => {
    return summary?.replace(/'|\[|\]|\n/g, "").split(", ");
  };

  return (
    <List sx={{ padding: 0 }}>
      {items.map((item) => (
        <ListItem alignItems="flex-start" key={item.match_id}>
          <ListItemAvatar>
            <Avatar
              sx={{ width: "40px", height: "40px" }}
              className={styles.avatar}
            >
              {item.user_name[0]}
            </Avatar>
          </ListItemAvatar>
          <div className={styles.userContent}>
            <div className={styles.userName}>{item.user_name}</div>
            <div className={styles.summaryContainer}>
              <div className={styles.summaryTitle}>요약본</div>
              <div
                className={styles.summaryContent}
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >
                {item.summary_content
                  ? makeSummaryContent(item.summary_content).join("\n")
                  : "(내용 없음)"}
              </div>
            </div>
            <div className={styles.summaryContainer}>
              <div className={styles.summaryTitle}>원본</div>
              <div
                className={styles.summaryContent}
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >
                {item.original_content ? item.original_content : "(내용 없음)"}
              </div>
            </div>
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default SummaryContents;
