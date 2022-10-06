import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const RegisterPage = () =>{
    const [userInfo, setUserInfo] = useState({
        name : "",
        id : "",
        checkid : false,
        password : "",
        validationPW : false,
        checkpw : "",
        email : "",
        phone : ""
    });
    const [emaildata , setEmailData] = useState({
        emaildata1 : "",
        emaildata2 : "",
        emailwriter : true
    });
    const [teldata, setTeldata] = useState({
        tel1: "",
        tel2: "",
        tel3: ""
    })
    const navigate = useNavigate();
    const handleIDDuplicate = (e) =>{
        const url = `http://3.39.169.146/users?id=${userInfo.id}`
        axios.get(url)
            .then(function (res){
                console.log(res);
                switch(res.data.code){
                    case 1000 : {
                        if(res.data.result.unique){
                            alert("사용가능한 아이디 입니다.");

                        }else{
                            alert("이미 존재하는 아이디 입니다.");
                        }
                        setUserInfo({
                            ...userInfo,
                            checkid : true
                        })

                        break;
                    }
                    case 2017 : {
                        alert("아이디를 입력해주세요");
                        break;
                    }
                    case 4000 : {
                        alert("database error");
                        break;
                    }
                    case 4001 : {
                        alert("Server error");
                        break;
                    }

                }
            })
    }
    const handleEmailWrite = (e) =>{
        const select = document.getElementById("email-origin-selector");
        const selectedOption = select.options[select.selectedIndex].value;
        console.log(selectedOption);
        if(selectedOption === 'write'){
            console.log(...emaildata);
            setEmailData({
                ...emaildata,
                emaildata : "",
                emailwriter : true
            });
        }else{
            setEmailData({
                ...emaildata,
                emaildata2 : selectedOption,
                emailwriter : false
            });
        }

    }
    useEffect(() =>{
        setUserInfo({
            ...userInfo,
            email : `${emaildata.emaildata1}@${emaildata.emaildata2}`
        });
    },[emaildata]);

    const changeEmail = (e) =>{
        setEmailData({
            ...emaildata,
            emaildata1 : e.target.value
        });
    }
    const changeEmaildata2 = (e) =>{
        setEmailData({
            ...emaildata,
            emaildata2 : e.target.value
        });
        setUserInfo({
            ...userInfo,
            email : `${emaildata.emaildata1}@${emaildata.emaildata2}`
        });
    }
    const handleCancel = () =>{
        if(window.confirm("회원가입을 취소하시겠습니까?")){
            navigate('/Login');
        }else{
            console.log("cancel");
        }
    }
    const inputChange = (e) =>{
        setUserInfo({
           ...userInfo,
           [e.target.id] : e.target.value
        });
        if (e.target.id == "password"){
            validatePassword(e.target.value);
        }
        if (e.target.id == "checkpw"){
            checkpassword(e.target.value);
        }
    }
    const checkpassword = (value)=>{
        const checkpwPTag = document.getElementById("checkpwPTag");
        if(userInfo.password == userInfo.checkpw){
            checkpwPTag.innerText=""
        }
        else{
            checkpwPTag.innerText="비밀번호와 일치하지 않습니다."
        }
    }
    const validatePassword = (value) =>{
        var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/
        // 형식에 맞는 경우 true 리턴
        console.log('비밀번호 유효성 검사 :: ', regExp.test(value));
        const vaildationTagP = document.getElementById("validation password");
        if(!regExp.test(value)){
            vaildationTagP.innerText = "8-10자리 영어, 숫자조합으로 입력해주세요";
        }else{
            setUserInfo({
                ...userInfo,
                validationPW : true
            })
            vaildationTagP.innerText = "";
        }
    }
    const inputtelChange = (e) => {
        setTeldata({
            ...teldata,
            [e.target.id] : e.target.value
        });

    }
    const infoclear = () =>{
        const select = document.getElementById("email-origin-selector");
        select.selectedIndex = 0;
        setEmailData({
            emaildata1 : "",
            emaildata2 : "",
            emailwriter : true
        });
        setTeldata({
            tel1: "",
            tel2: "",
            tel3: ""
        });
        setUserInfo({
            ...userInfo,
            name : "",
            id : "",
            checkid : false,
            password : "",
            checkpw : "",
            email : "",
            phone : ""
        });
    }

    useEffect(() =>{
        setUserInfo({
            ...userInfo,
            phone : `${teldata.tel1}-${teldata.tel2}-${teldata.tel3}`
        });
    },[teldata]);

    const handleSubmit = () =>{
        console.log(userInfo);
        if(userInfo.checkid && userInfo.validationPW && userInfo.password == userInfo.checkpw){
            axios.post("http://3.39.169.146/users/signup",{
                name : userInfo.name,
                id : userInfo.id,
                password : userInfo.password,
                email : userInfo.email,
                phone : userInfo.phone
            })
                .then(function(res){
                    console.log(res);
                    if(res.status == "200") {
                        switch (res.data.code){
                            case 1000 : {
                                alert("회원가입이 완료되었습니다");
                                navigate('/Login');
                                break;
                            }
                            case 2001 : {
                                alert("빠진 내용을 기입해주세요.(이름, 아이디, 비밀번호, 이메일은 필수항목 입니다.)");
                                break;
                            }
                            case 2003 : {
                                alert("이메일 형식을 정확히 기입해주세요");
                                break;
                            }
                            case 3002 : {
                                alert("중복된 아이디 입니다.");
                                break;
                            }
                            case 3001 : {
                                alert("중복된 이메일 입니다.");
                                break;
                            }
                            case 4000 : {
                                alert("데이터베이스 오류");
                                break;
                            }
                            case 4000 : {
                                alert("서버에러 404 Nor Found");
                                navigate('/Login');
                                break;
                            }

                        }

                    }

                })
                .catch(error =>
                {if(error.status === "400"){
                    alert("서버에러");
                }
                })
                .finally(()=>{
                    infoclear();
                });
        }else{
            alert("id 중복확인을 해주세요");
        }

    }
    return (
        <div>
            <p>회원가입</p>
            <b>이름</b>
            <input id="name" type="text" required value={userInfo.name} onChange={inputChange}/>
            <br/>
            <b>아이디</b>
            <input id="id" type="text" required value={userInfo.id} onChange={inputChange}/>
            <button onClick={handleIDDuplicate}>중복확인</button>
            <br/>
            <b>비밀번호</b>
            <input id="password" type="password" required value={userInfo.password} onChange={inputChange}/>
            <br/>
            <p>8-10자리 영문,숫자 조합</p>
            <p id="validation password"></p>
            <b>비밀번호 확인</b>
            <input id="checkpw" type="password" required value={userInfo.checkpw} onChange={inputChange}/>
            <br/>
            <p id="checkpwPTag"></p>
            <b>이메일</b>
            <input type="text" required value={emaildata.emaildata1} onChange={changeEmail}/>@
            { emaildata.emailwriter ? <input type='text' name='signup_email_write' maxLength='20' value={emaildata.emaildata2} onChange={changeEmaildata2}/>
                : null
            }
            <select id='email-origin-selector' name="selectEmail" onChange={handleEmailWrite}>
                <option value="write">직접입력</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
                <option value="nate.com">nate.com</option>
                <option value="hanmail.com">hanmail.com</option>
            </select>

            <br/>
            <b>전화번호</b>
            <input id="tel1" type="tel" maxLength="3" value={teldata.tel1} onChange={inputtelChange}/> -
            <input id="tel2" type="tel" maxLength="4" value={teldata.tel2} onChange={inputtelChange}/> -
            <input id="tel3" type="tel" maxLength="4" value={teldata.tel3} onChange={inputtelChange}/>
            <br/>
            <button onClick={handleCancel}>취소</button>
            <button onClick={handleSubmit}>회원가입</button>
        </div>
    );

}
export default RegisterPage;