import React, {useState, useEffect} from 'react';
import style from './Meeting.module.css';

const NewMeetingModal = ({handleAddCancel, handleAddSubmit}) =>{
    const [todayYear, setTodayYear] = useState();
    const [todayMonth, setTodayMonth] = useState();
    const [todayDay, setTodayDay] = useState();
    const [dayOfWeek, setDayOfWeek] = useState();

    useEffect(() =>{
        const week = ['일','월','화','수','목','금','토'];
        const now = new Date();
        setTodayYear(now.getFullYear());
        setTodayMonth(now.getMonth() + 1);
        setTodayDay(now.getDate());
        setDayOfWeek(week[now.getDay()]);
    },[]);


    const onCancel = () =>{
        handleAddCancel();
    }

    const onAddSubmit = (e) =>{
        e.preventDefault();
        handleAddSubmit();
    }
return(
     <>
     <div className={style.modalBG}>
        <div className={style.modalcover}>
            <div className={style.modalclose}>
                <img id={style.closeimg} onClick={onCancel} width="20px" height="20px" src={"img/close.png"}/>
            </div>
            <div>
                <h2>➕ 새 회의 개설</h2>
            </div>
            <div>
                <b>회의 개설 날짜</b>
                &nbsp; <span>{`${todayYear}/${todayMonth}/${todayDay}(${dayOfWeek})`}</span><br/>
                <b>회의명</b>
                &nbsp;&nbsp;&nbsp;<input type='text' required/><br/>
                <b>회의 주제</b>
                &nbsp;&nbsp;&nbsp;<input type='text'/><br/>
            </div>
            <div>
                <button onClick={onCancel}>취소</button>
                <button onClick={onAddSubmit}>추가</button>
            </div>
        </div>
    </div>    
     </>
);
};

export default NewMeetingModal;