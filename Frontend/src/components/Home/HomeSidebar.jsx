import React, {useState} from 'react';
import styles from "./HomeSidebar.module.css";
import Avatar from "@mui/material/Avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import useIntersectionObserver from './useIntersectionObserver';

const HomeSidebar = () => {
  const navigator = useNavigate();

  const [activeID,setActiveID] = useState('content1');
  useIntersectionObserver(setActiveID);

  return (
      <div className={styles.sidebar}>
        <div className={styles.logo} >
          <img width="200px" alt="MEETLOG" src="img/logo.png" />
        </div>
        <div className={styles.userProfile}>
          <Avatar
              sx={{ width: "70px", height: "70px", margin: "auto", mb: "10px" }}
          >
          </Avatar>
          <Button variant="outlined"
            sx={{mt:"10px"}} onClick={()=>{navigator('/login')}}>︎👇🏻 로그인 하러가기</Button>
        </div>
        <div className={styles.menu}>
          <ul>
            <li className={styles.menuTitle}>🖥 MEETLOG LIST</li>
            <ul className={styles.menuContent}>
              <li className={activeID === "content1" ? styles.active : styles.menuItem}>
                <a
                href="#content1" >
                  밋로그란?
                </a>
              </li>
              <li className={activeID === "content2" ? styles.active : styles.menuItem}>
                <a
                    href="#content2">
                  기능상세
                </a>
              </li>
              <li className={activeID === "content3" ? styles.active : styles.menuItem}>
                <a
                    href="#content3">
                  사용방법
                </a>
              </li>
              <li className={activeID === "content4" ? styles.active : styles.menuItem}>
                <a
                    href="#content4">
                  사용해보기
                </a>
              </li>
            </ul>
          </ul>


        </div>
        <div className={styles.myPage}>@밋로그:MEETLOG</div>
      </div>
  );
};

export default HomeSidebar;