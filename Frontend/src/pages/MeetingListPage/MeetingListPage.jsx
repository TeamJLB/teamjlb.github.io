import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Meetings from '../../components/Meetings';
import NewMeeingModal from '../../components/NewMeetingModal';
import style from './MeetingListPage.module.css';
import {useLocation} from 'react-router-dom';
import Sidebar from "./Sidebar";

const MeetingListPage = () => {
    const location = useLocation();
    const USER_TOKEN = location.state.userToken;
    const navigate = useNavigate();
    const [info, setInfo] = useState([]);
    const [modalOn, setModalOn] = useState(false);
    const config = {
        headers :{
            'x-access-token' : USER_TOKEN
        }
    }
    useEffect(()=>{
        axios.get('http://3.39.169.146/meetings/allList',config)
            .then(res => {
                setInfo(res.data.result);
            })
            .catch(err => console.log(err));
    }, []);

    const handleEnterHistory = (meetingid) =>{
        navigate('/history',{state : config, id: meetingid});
    }
    const handleEnterMeeting = (meetingID) => {
        navigate('/meetingRoom',{meeting_id: meetingID});
        alert('enter Meeting');
    }
    const handleRemove = (id) =>{
        alert(`${id} Remove`);
        setInfo(info => info.filter(item => item.meeting_id !== id));
    }
    const handleAddMeeting = () =>{
        console.log("click")
        setModalOn(true);
    }
    const handleAddCancel = () =>{
        setModalOn(false);
    }
    const handleAddSubmit = (meetingName, topic) =>{
        setModalOn(false);
        console.log("회의 명 : ",meetingName);
        console.log("주제: ",topic)
        axios.post("http://3.39.169.146/meetings/newMeeting",{
        data: {
             metting_name: meetingName,
             topic: topic
         }},config)
             .then((res)=>{
                 console.log(res)
             })
         alert('add hh');
    }

  return (
    <div className="body">
        <div className="sidebar">
            side
        </div>
        <div className="content">
            <div>
            <h1>전체 회의 리스트</h1>
            </div>
            <div>
                <form>
                    <input type='text'/>
                    <button>참가</button>
                </form>
            </div>
            <div className={style.gridscroll}>
                <div className={style.grid}>
                    <Meetings info={info} handleEnterHistory={handleEnterHistory} handleEnterMeeting={handleEnterMeeting} handleRemove={handleRemove}/>
                    <p className={style.makeNewMeetingBtn} onClick={handleAddMeeting}>➕ 회의 만들기</p>
                </div>
                {modalOn && <NewMeeingModal handleAddCancel={handleAddCancel} handleAddSubmit={handleAddSubmit}/>}
            </div>
        </div>
    </div>
  );
};

export default MeetingListPage;
