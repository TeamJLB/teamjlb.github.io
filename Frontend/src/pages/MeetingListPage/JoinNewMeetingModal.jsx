import React, {useState, useEffect} from 'react';
import './MeetingListPage.css';

const joinNewMeetingModal = ({handleJoinMeetingCancel, handleJoinSubmit}) =>{
    const onCancel = () =>{
        handleJoinMeetingCancel();
    }
    const onAddSubmit = () =>{
        handleJoinSubmit();
    }
    return (
        <>
            <div>
                <h2>➕ 새 회의 참가</h2>
            </div>
            <div>
                <b>회의 ID</b><br/>
                <input type='text' required placeholder="참가할 회의의 ID를 입력해주세요"/><br/>
            </div>
            <div>
                <button onClick={onCancel}>취소</button>
                <button onClick={onAddSubmit}>참가</button>
            </div>
        </>
    );
}
export default joinNewMeetingModal;