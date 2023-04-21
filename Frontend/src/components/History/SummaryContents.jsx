import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import styles from "./SummaryContents.module.css";
import OriginalContent from "./OriginalContent";

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
            <div
              className={styles.summaryContent}
              style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
            >
              {item.summary_content
                ? makeSummaryContent(item.summary_content).map((content) => {
                    return `🗣 ${content}\n`;
                  })
                : "(내용 없음)"}
            </div>
            <OriginalContent item={item} />
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default SummaryContents;
