import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Button,Typography , Link} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import './LoginPage.css';
import meetingListPage from '../MeetingListPage/MeetingListPage';


const LoginPage = ()=> {
    const [loginid, setLoginid] = useState("");
    const [loginpw, setLoginpw] = useState("");
    const [showPW, setShowPW] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = (e) => {

        setLoading(true);
        axios.post("http://3.39.169.146/users/login",{
            id: loginid,
            password: loginpw
        })
            .then(function (res){
            console.log(res);
            if(res.status == "200"){
                console.log("code : " + res.data.code);
                switch (res.data.code){
                    case 1000 : {
                        alert('로그인 성공');
                        const userToken = res.data.result.jwt;
                        console.log(userToken);
                        localStorage.setItem('refresh-token',userToken['refresh-token']);
                        if(userToken){
                            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
                        }else{
                            delete axios.defaults.headers.common['Authorization']
                        }
                        navigate('/meetingList',{state : {userToken}});
                        // meetingListPage(userToken);
                        break;
                    }
                    case 3003 : {
                        alert("등록되지 않은 아이디 입니다. 아이디를 다시 확인해주세요");
                        break;
                    }
                    case 3004 : {
                        alert("비밀번호를 확인해 주세요");
                        break;
                    }
                    case 3005 : {
                        alert("비활성화 된 계정입니다. 고객센터에 문의해주세요.");
                        break;
                    }
                    case 3006 : {
                        alert("탈퇴 된 계정입니다. 고객센터에 문의해주세요.");
                        break;
                    }
                }
                setLoading(false);
            }else{
                if(res.status == "400"){
                    alert("회원정보를 확인해주세요");
                }
                console.log(res);
                setLoading(false);
            }
            })
            .catch(error =>
            {if(error.status === "400"){
                alert("회원정보를 확인해주세요");
            }
            })
            .finally(()=>{
                setLoginid("");
                setLoginpw("");
            }
            );



    }
    const handleLoginCancel = () =>{
        navigate("/");
    }
    const handleShowPW = () =>{
        setShowPW(!showPW);
    }
    
    return (
        <div className="loginForm">
            <LockOutlinedIcon/>
            <Typography component="h1" variant="h5" >Login</Typography>
            <TextField id="userid" margin="normal" label="ID" variant="outlined" required fullWidth value={loginid} onChange={e=> setLoginid(e.target.value)}/>
            <TextField
                id="userpw"
                margin="normal"
                label="Password"
                type = {showPW ? 'text' : 'password'}
                variant="outlined"
                required
                fullWidth
                value={loginpw}
                InputProps={{endAdornment: (
                <InputAdornment position='end'>
                    <IconButton onClick={handleShowPW}>
                        {showPW ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>)}}
                onChange={e=> setLoginpw(e.target.value)}/>
            <Button sx={{ mt: 1, mb: 2 }} fullWidth variant="outlined" onClick={handleLoginCancel}>취소</Button>
            <LoadingButton
                    fullWidth
                    loading={loading}
                    variant="contained"
                    sx={{ mb: 2 }}
                    onClick={handleLogin}>login</LoadingButton>
            <Link href="/register">아직 계정이 없다면? 회원가입</Link>
        </div>
    );
}

export default LoginPage;