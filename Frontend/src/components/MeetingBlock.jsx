import React from 'react';
import style from './Meeting.module.css'

const MeetingBlock = ({item, handleEnterHistory, handleEnterMeeting, handleRemove}) =>{
    const onRemove = () =>{
        handleRemove(item.meeting_id);
    }
    const onEnterHistory = () => {
        handleEnterHistory(item);
    }
    const onEnterMeeting = () =>{
        handleEnterMeeting(item);
    }
    return(
        <div className={style.meetingBlock}>
            <span>{item.createdAt.split('T')[0]}</span>
            <br/>
            <span>{item.meeting_id}</span>
            <br/>
            <span>{item.meeting_name}</span>
            <br/>
            <div>
                <button onClick={onEnterHistory}>회의 히스토리</button>
            </div>
            <div>
                <button onClick={onEnterMeeting}>참가</button>
            </div>
            <div>
                <button onClick={onRemove}>삭제</button>
            </div>
        </div>


    );
}

export default MeetingBlock;