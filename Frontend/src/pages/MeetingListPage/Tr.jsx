import React from 'react';
import Td from './Td';

const Tr = ({info, handleEnterHistory, handleEnterMeeting, handleRemove}) => {
    return(
        <>
        {
            info?.map(item =>{
                return(
                    <Td key={item.meeting_id} item={item} handleEnterHistory={handleEnterHistory} handleEnterMeeting={handleEnterMeeting} handleRemove={handleRemove}/>
                )
            })
        }
        </>
    );
};

export default Tr;