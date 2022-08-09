import React from 'react';

const Td = ({item, handleEnterHistory, handleEnterMeeting, handleRemove}) =>{
    const onRemove = () =>{
        handleRemove(item.id);
    }
    const onEnterHistory = () => {
        handleEnterHistory(item);
    }
    const onEnterMeeting = () =>{
        handleEnterMeeting(item);
    }
    return(
        <tr>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
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