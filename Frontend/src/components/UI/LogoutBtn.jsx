import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './LogoutBtn.module.css';

const LogoutBtn = () =>{

  const location = useLocation();
  const navigator = useNavigate();

  const handleClink = () => {
    navigator('/')

  }

  if (location.pathname === "/") return null;
  if (location.pathname === "/login") return null;
  if (location.pathname === "/register") return null;
  if (location.pathname === "/meetingRoom") return null;

  return (
      <div className={styles.logoutBtn}>
        <Button variant={'outlined'} color={'error'} onClick={handleClink}> 로그아웃 </Button>
      </div>
  )
}

export default LogoutBtn;