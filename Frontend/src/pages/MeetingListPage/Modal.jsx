import React, {useState, useEffect} from 'react';
import './MeetingListPage.css';
import JoinNewMeetingModal from './JoinNewMeetingModal';
import NewMeetingModal from './NewMeetingModal';

const Modal = ({handleAddCancel, handleAddSubmit, handleJoinSubmit}) =>{
    const [MeetingmodalOn, setMeetingModalOn] = useState(false);
    const [JoinMeetingmodalOn, setJoinMeetingModalOn] = useState(false);
    const handleCreateMeeting = () =>{
       setMeetingModalOn(true);
    }
    const onCancel = () =>{
        handleAddCancel();
    }
    const onAddSubmit = (e) =>{
        e.preventDefault();
        handleAddSubmit();
    }
    const handleMeetingModalCancel = () =>{
        setMeetingModalOn(false);
    }
    const handleJoinNewMeeting = () =>{
        setJoinMeetingModalOn(true);
    }
    const handleJoinMeetingCancel = () =>{
        setJoinMeetingModalOn(false);
    }
return(
    <div className="modal-bg">
        <div className="modal">
            <div className="modalclose">
                <img id="closeimg" onClick={onCancel} width="20px" height="20px" src={"img/close.png"}/>
            </div>
            <div>
                {!(MeetingmodalOn || JoinMeetingmodalOn) && <><button onClick={handleCreateMeeting}>새 회의 개설</button><br/></>}
                {MeetingmodalOn && <NewMeetingModal handleMeetingModalCancel={handleMeetingModalCancel} handleAddSubmit={handleAddSubmit}/>}
                {!(MeetingmodalOn || JoinMeetingmodalOn)&& <button onClick={handleJoinNewMeeting}>새 회의 참가</button>}
                {JoinMeetingmodalOn && <JoinNewMeetingModal handleJoinMeetingCancel={handleJoinMeetingCancel} handleJoinSubmit={handleJoinSubmit}/>}
            </div>
        </div>
    </div>

);
};

export default Modal;