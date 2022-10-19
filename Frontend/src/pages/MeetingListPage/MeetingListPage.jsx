import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Meetings from '../../components/MeetingListBlock/Meetings';
import NewMeeingModal from '../../components/MeetingListBlock/NewMeetingModal';
import style from './MeetingListPage.module.css';
import {useLocation} from 'react-router-dom';
import Sidebar from "./Sidebar";

const MeetingListPage = () => {
    const location = useLocation();
    const USER_TOKEN = location.state.userToken;
    const navigate = useNavigate();
    const [info, setInfo] = useState([]);
    const [inputID, setInputID] = useState('');
    const [modalOn, setModalOn] = useState(false);
    const config = {
        headers :{
            'x-access-token' : USER_TOKEN
        }
    }
    useEffect(()=>{
        loadList();
    }, []);

    const loadList = () =>{
        axios.get('http://3.39.169.146/meetings/allList',config)
            .then(res => {
                if(res.data.isSuccess){
                    setInfo(res.data.result);
                }
            })
            .catch(err => console.log(err));
    }

    const handleEnterHistory = (meetingid) =>{
        navigate('/history',{state : {config : config, meeting_id: meetingid}});
    }
    const handleEnterMeeting = (meetingID) => {
        navigate('/meetingRoom', {state: {config : config, meeting_id: meetingID}});
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
             meeting_name: meetingName,
             topic: topic
         },config)
             .then((res)=>{
                if (res.data.isSuccess){
                    loadList();
                }
             })
             
    }

    const searchMeeting = () =>{
        axios.post(`http://3.39.169.146/meetings/newMeeting/${inputID}`,'',config)
            .then((res)=>{
                if (res.data.isSuccess){
                    handleEnterMeeting(inputID);
                }
            })
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
                ID로 회의 입장하기 
                <input id="inputMeetingID" type='text' onChange={e=>{setInputID(e.target.value); console.log(inputID)}}/>
                <button onClick={searchMeeting}>입장</button>
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
