import React, { useEffect, useState } from "react";
import axios from 'axios';
import Tr from './Tr';
import Modal from './Modal';
import './MeetingListPage.css';
import {useLocation} from 'react-router-dom';

const MeetingListPage = () => {
    const location = useLocation();
    const USER_TOKEN = location.state.userToken;
    console.log("meetingList : "+USER_TOKEN);
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
                console.log(res.data.result);
                setInfo(res.data.result);
                console.log(info);
            })
            .catch(err => console.log(err));
    }, []);

    const handleEnterHistory = (item) =>{
        alert('enter History');
    }
    const handleEnterMeeting = (item) => {
        alert('enter Meeting');
    }
    const handleRemove = (id) =>{
        alert(`${id} Remove`);
        setInfo(info => info.filter(item => item.meeting_id !== id));
    }
    const handleAddMeeting = () =>{
        setModalOn(true);
    }
    const handleAddCancel = () =>{
        setModalOn(false);
    }
    const handleAddSubmit = () =>{
        setModalOn(false);
        alert('add hh');
    }
    const handleJoinSubmit = () =>{
        setModalOn(false);
        alert('join hh');
    }
  return (

    <div>
        <div>
        <h1>전체 회의 리스트</h1>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>회의 개설 날짜</th>
                        <th>회의 ID</th>
                        <th>회의명</th>
                        <th>회의 히스토리</th>
                        <th>회의 참가</th>
                        <th>회의 삭제</th>
                    </tr>
                </thead>
                <tbody>
                    <Tr info={info} handleEnterHistory={handleEnterHistory} handleEnterMeeting={handleEnterMeeting} handleRemove={handleRemove}/>
                    <tr>
                        <td onClick={handleAddMeeting}>➕ 새 회의 추가</td>
                    </tr>
                </tbody>
            </table>
            {modalOn && <Modal handleAddCancel={handleAddCancel} handleAddSubmit={handleAddSubmit} handleJoinSubmit={handleJoinSubmit}/>}

        </div>
    </div>
  );
};

export default MeetingListPage;
