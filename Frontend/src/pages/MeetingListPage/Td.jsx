import React from 'react';

const Td = ({item, handleEnterHistory, handleEnterMeeting, handleRemove}) =>{
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
        <tr>
            <td>{item.createdAt.split('T')[0]}</td>
            <td>{item.meeting_id}</td>
            <td>{item.meeting_name}</td>
            <td>
                <button onClick={onEnterHistory}>회의 히스토리</button>
            </td>
            <td>
                <button onClick={onEnterMeeting}>참가</button>
            </td>
            <td>
                <button onClick={onRemove}>삭제</button>
            </td>
        </tr>

    );
}

export default Td;