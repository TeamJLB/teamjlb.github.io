import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import styles from "./SummaryContents.module.css";

const SummaryContents = (props) => {
  const { items } = props;
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
            <div className={styles.summaryContent}>
              요약 : {item.summary_content}
            </div>
            <div className={styles.originalContent}>
              원본 : {item.original_content}
            </div>
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default SummaryContents;
