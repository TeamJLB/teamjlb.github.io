import React, {useEffect, useState} from 'react';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import style from './TimeLineList.module.css'
import axios from 'axios';
import host_config from '../../config/serverHost';

const Timeitem = (props) =>{
  const { subMeetingId, date, time, topic, participants, config } = props;
  const [participantsCheck,setparticipantsCheck] = useState(true);

  useEffect(()=>{
        axios
          .get(`http://${host_config.current_host}:${host_config.current_port}/users/userInfo`,
              config
          )
          .then((res) => {
            console.log(participants.indexOf(res.data.result.user_name))
            if (participants.indexOf(res.data.result.user_name) < 0){
              setparticipantsCheck(false);
            }
          })},[]);


  return (
      <TimelineItem mb={0}>
        <TimelineOppositeContent color="text.secondary">
          <div className={style.date}>{date}</div>
          <div className={style.date}>{time}</div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          { participantsCheck ? <TimelineDot variant="outlined" color="primary" /> : <TimelineDot /> }
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent className={style.timecontent} sx={{ py: '12px', px: 2 }}>
          <div>
            {topic}
          </div>
        </TimelineContent>
      </TimelineItem>
  );
}

export default Timeitem;