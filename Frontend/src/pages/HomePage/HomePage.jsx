import 'react-notion/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css'; // only needed for code highlighting
import React,{ useEffect, useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { NotionRenderer } from 'react-notion';
import HomeSidebar from '../../components/Home/HomeSidebar';
import styles from './HomePage.module.css';
import Button from '@mui/material/Button';

const HomePage = () => {
  const navigator = useNavigate();

  const notion = (notionID) =>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [response, setResponse] = useState({});

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const NOTION_PAGE_ID = notionID;
      axios
          .get(`https://notion-api.splitbee.io/v1/page/${NOTION_PAGE_ID}`)
          .then(({data}) => {
            setResponse(data);
          });
    }, []);

    return (
        Object.keys(response).length && (
            <NotionRenderer blockMap={response} fullPage={true}/>
        )
    );
  }


  return (
      <div className={styles.body} style={{'overflowX': 'hidden'}}>
        <HomeSidebar/>
        <div className={styles.top}>
          <div className={styles.top__button}>
            <Button variant='outlined' sx={{m:'5px'}} onClick={()=>{navigator('login')}}>로그인</Button>
            <Button variant='contained' sx={{m:'5px'}} onClick={()=>{navigator('register')}}>회원가입</Button>
          </div>
        </div>
        <div className={styles.maindiv}>
          <div className={styles.text}>
            <div id="content1" className="content">
              {notion('MEETLOG-be364f85a04e4c9c9e180018c3d9a1b2')}
            </div>
            <div id="content2" className="content">
              {notion('bd3581c6f33c47679591d4486c562f8d')}
            </div>
            <div id="content3" className="content">
              {notion('ff267ed19fed442ba9104dcbd9b59212')}
            </div>
            <div id="content4" className="content">
              <div className={styles.forUse}/>
              <div className={styles.LetUse}>
                <div className={styles.useContent}>
                  <div className={styles.logo}>
                    <img width="200px" alt="MEETLOG" src="img/logo.png" />
                  </div>
                  <h1>지금 바로 밋로그를 사용해 보세요!</h1>
                  <Button variant={'contained'} onClick={()=>{navigator('register')}}>회원가입</Button>
                </div>
                <div className={styles.contributor}>
                  <h3>contributor</h3>
                  <div>
                    <span className={styles.contributorItem}> Jwa Jeonghyeon</span>
                    <span className={styles.contributorItem}> Byun JaeHo</span>
                    <span className={styles.contributorItem}> Lee Haeihn</span>
                  </div>
                  <p style={{color:'gray'}}> Konkuk Univ. Department of software, Department of computer engineering </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default HomePage;
