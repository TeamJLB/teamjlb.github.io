import React from 'react';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import style from './TimeLineList.module.css'

const Timeitem = (props) =>{
  const { subMeetingId, date, time, topic, participants, config } = props;

  return (
      <TimelineItem mb={0}>
        <TimelineOppositeContent color="text.secondary">
          <div className={style.date}>{date}</div>
          <div className={style.date}>{time}</div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          {topic? <TimelineDot variant="outlined" color="primary" /> : <TimelineDot />}
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <div>
            {topic}
          </div>
        </TimelineContent>
      </TimelineItem>
  );
}

export default Timeitem;