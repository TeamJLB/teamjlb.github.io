import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Link, MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { LoadingButton } from "@mui/lab";
import CallIcon from "@mui/icons-material/Call";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import Select from "@mui/material/Select";
import "./RegisterPage.css";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import host_config from "../../config/serverHost";

const RegisterPage = () => {
  const theme = createTheme();
  const [showPW, setShowPW] = useState(false);
  const [showPW2, setShowPW2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState("@naver.com");
  const [userInfo, setUserInfo] = useState({
    name: "",
    id: "",
    checkid: false,
    password: "",
    validationPW: true,
    checkpw: "",
    sameCheckPW: true,
    email: "",
    phone: "",
    validationPhone: true,
  });
  const [emaildata, setEmailData] = useState({
    emaildata1: "",
    emaildata2: "@naver.com",
    emailwriter: true,
  });
  const navigate = useNavigate();
  const handleIDDuplicate = (e) => {
    const url = `http://${host_config.current_host}:${host_config.current_port}/users?id=${userInfo.id}`;
    axios.get(url).then(function (res) {
      console.log(res);
      switch (res.data.code) {
        case 1000: {
          if (res.data.result.unique) {
            alert("사용가능한 아이디 입니다.");
            setUserInfo({
              ...userInfo,
              checkid: true,
            });
          } else {
            alert("이미 존재하는 아이디 입니다.");
          }

          break;
        }
        case 2017: {
          alert("아이디를 입력해주세요");
          break;
        }
        case 4000: {
          alert("database error");
          break;
        }
        case 4001: {
          alert("Server error");
          break;
        }
      }
    });
  };
  const handleEmailWrite = (e) => {
    setOption(e.target.value);
    const emailForm = document.getElementById("signup_email_write");
    const selectedOption = e.target.value;
    console.log(selectedOption);
    if (selectedOption === "write") {
      console.log(emaildata);
      setEmailData({
        ...emaildata,
        emaildata2: "@",
        emailwriter: true,
      });
    } else {
      setEmailData({
        ...emaildata,
        emaildata2: selectedOption,
        emailwriter: false,
      });
    }
  };
  useEffect(() => {
    setUserInfo({
      ...userInfo,
      email: `${emaildata.emaildata1}${emaildata.emaildata2}`,
    });
  }, [emaildata]);

  const changeEmail = (e) => {
    setEmailData({
      ...emaildata,
      emaildata1: e.target.value,
    });
  };
  const changeEmaildata2 = (e) => {
    setEmailData({
      ...emaildata,
      emaildata2: e.target.value,
    });
    setUserInfo({
      ...userInfo,
      email: `${emaildata.emaildata1}${emaildata.emaildata2}`,
    });
  };
  const handleCancel = () => {
    if (window.confirm("회원가입을 취소하시겠습니까?")) {
      navigate("/Login");
    } else {
      console.log("cancel");
    }
  };
  const inputChange = (e) => {
    if (e.target.id == "password") {
      if (validatePassword(e.target.value)) {
        console.log(userInfo);
        setUserInfo({
          ...userInfo,
          validationPW: true,
          [e.target.id]: e.target.value,
        });
      } else {
        setUserInfo({
          ...userInfo,
          validationPW: false,
          [e.target.id]: e.target.value,
        });
      }
    } else if (e.target.id == "phone") {
      if (validatePhone(e.target.value)) {
        console.log(userInfo);
        setUserInfo({
          ...userInfo,
          validationPhone: true,
          [e.target.id]: e.target.value,
        });
      } else {
        setUserInfo({
          ...userInfo,
          validationPhone: false,
          [e.target.id]: e.target.value,
        });
      }
    } else if (e.target.id == "checkpw") {
      setUserInfo({
        ...userInfo,
        [e.target.id]: e.target.value,
      });
    } else {
      setUserInfo({
        ...userInfo,
        [e.target.id]: e.target.value,
      });
    }
  };
  const validatePhone = (value) => {
    console.log(value);
    var regExp = /^\d{10,11}$/;
    // 형식에 맞는 경우 true 리턴
    console.log("비밀번호 유효성 검사 :: ", regExp.test(value));

    if (regExp.test(value)) {
      return true;
    }
    return false;
  };

  const checkPassWord2 = () => {
    if (userInfo.password === userInfo.checkpw) {
      setUserInfo({
        ...userInfo,
        sameCheckPW: true,
      });
    } else {
      setUserInfo({
        ...userInfo,
        sameCheckPW: false,
      });
    }
  };

  const validatePassword = (value) => {
    console.log(value);
    var regExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,10}$/;
    // 형식에 맞는 경우 true 리턴
    console.log("비밀번호 유효성 검사 :: ", regExp.test(value));

    if (regExp.test(value)) {
      return true;
    }
    return false;
  };
  const infoclear = () => {
    const select = document.getElementById("email-origin-selector");
    select.selectedIndex = 0;
    setEmailData({
      emaildata1: "",
      emaildata2: "",
      emailwriter: true,
    });
    setUserInfo({
      ...userInfo,
      name: "",
      id: "",
      checkid: false,
      password: "",
      checkpw: "",
      email: "",
      phone: "",
    });
  };

  const handleSubmit = () => {
    console.log(userInfo);
    if (
      userInfo.checkid &&
      userInfo.validationPW &&
      userInfo.password === userInfo.checkpw
    ) {
      axios
        .post(
          `http://${host_config.current_host}:${host_config.current_port}/users/signup`,
          {
            name: userInfo.name,
            id: userInfo.id,
            password: userInfo.password,
            email: userInfo.email,
            phone: userInfo.phone,
          }
        )
        .then(function (res) {
          console.log(res);
          if (res.status == "200") {
            switch (res.data.code) {
              case 1000: {
                alert("회원가입이 완료되었습니다");
                navigate("/Login");
                break;
              }
              case 2001: {
                alert(
                  "빠진 내용을 기입해주세요.(이름, 아이디, 비밀번호, 이메일은 필수항목 입니다.)"
                );
                break;
              }
              case 2003: {
                alert("이메일 형식을 정확히 기입해주세요");
                break;
              }
              case 3002: {
                alert("중복된 아이디 입니다.");
                break;
              }
              case 3001: {
                alert("중복된 이메일 입니다.");
                break;
              }
              case 4000: {
                alert("데이터베이스 오류");
                break;
              }
              case 4000: {
                alert("서버에러 404 Nor Found");
                navigate("/Login");
                break;
              }
            }
          }
          setLoading(false);
        })
        .catch((error) => {
          if (error.status === "400") {
            alert("서버에러");
            setLoading(false);
          }
        })
        .finally(() => {
          infoclear();
        });
    } else {
      alert("id 중복확인을 해주세요");
    }
  };
  const handleShowPW = () => {
    setShowPW(!showPW);
  };
  const handleShowPW2 = () => {
    setShowPW2(!showPW2);
  };

  useEffect(() => {
    if (userInfo.password && userInfo.checkpw) {
      if (userInfo.password === userInfo.checkpw) {
        setUserInfo({
          ...userInfo,
          sameCheckPW: true,
        });
      } else {
        setUserInfo({
          ...userInfo,
          sameCheckPW: false,
        });
      }
    }
  }, [userInfo.password, userInfo.checkpw]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ height: "100vh" }}
            >
              <div className="registerForm">
                <Typography component="h1" variant="h5">
                  회원가입
                </Typography>
                <TextField
                  id="name"
                  margin="normal"
                  label="이름"
                  variant="outlined"
                  required
                  fullWidth
                  value={userInfo.name}
                  onChange={inputChange}
                />
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={8} sm={10}>
                    <TextField
                      id="id"
                      margin="normal"
                      label="ID"
                      variant="outlined"
                      required
                      fullWidth
                      value={userInfo.id}
                      onChange={inputChange}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2}>
                    <Button
                      variant="outlined"
                      xs={2}
                      onClick={handleIDDuplicate}
                    >
                      중복확인
                    </Button>
                  </Grid>
                </Grid>
                {userInfo.validationPW ? (
                  <TextField
                    id="password"
                    margin="normal"
                    label="Password"
                    type={showPW ? "text" : "password"}
                    required
                    variant="outlined"
                    fullWidth
                    value={userInfo.password}
                    helperText="8-10자리 영문,숫자 조합"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPW}>
                            {showPW ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={inputChange}
                  />
                ) : (
                  <TextField
                    error
                    id="password"
                    margin="normal"
                    label="Password"
                    type={showPW ? "text" : "password"}
                    variant="outlined"
                    required
                    fullWidth
                    value={userInfo.password}
                    helperText="8-10자리 영어, 숫자조합으로 입력해주세요"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPW}>
                            {showPW ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={inputChange}
                  />
                )}
                {userInfo.sameCheckPW ? (
                  <TextField
                    id="checkpw"
                    margin="normal"
                    label="Check Password"
                    type={showPW2 ? "text" : "password"}
                    variant="outlined"
                    required
                    fullWidth
                    value={userInfo.checkpw}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPW2}>
                            {showPW2 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={inputChange}
                  />
                ) : (
                  <TextField
                    error
                    id="checkpw"
                    margin="normal"
                    label="Check Password"
                    type={showPW2 ? "text" : "password"}
                    variant="outlined"
                    required
                    fullWidth
                    helperText="비밀번호와 일치하지 않습니다."
                    value={userInfo.checkpw}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPW2}>
                            {showPW2 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={inputChange}
                  />
                )}
                <Box justifyContent="center" alignItems="center">
                  <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={4}>
                      <TextField
                        margin="normal"
                        label="email"
                        variant="outlined"
                        required
                        fullWidth
                        value={emaildata.emaildata1}
                        onChange={changeEmail}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id="signup_email_write"
                        margin="normal"
                        label="email"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        value={emaildata.emaildata2}
                        onChange={changeEmaildata2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <InputLabel id="demo-simple-select-label">
                        email
                      </InputLabel>
                      <Select
                        sx={{ m: 1 }}
                        variant="standard"
                        labelId="demo-simple-select-label"
                        name="selectEmail"
                        id="email-origin-selector"
                        label="email"
                        sx={{ minWidth: 145 }}
                        value={option}
                        onChange={handleEmailWrite}
                      >
                        <MenuItem value={"@naver.com"}>@naver.com</MenuItem>
                        <MenuItem value="@gmail.com">@gmail.com</MenuItem>
                        <MenuItem value="@daum.net">@daum.net</MenuItem>
                        <MenuItem value="@nate.com">@nate.com</MenuItem>
                        <MenuItem value="@hanmail.com">@hanmail.com</MenuItem>
                        <MenuItem value="write">직접입력</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Box>
                {userInfo.validationPhone ? (
                  <TextField
                    id="phone"
                    margin="normal"
                    fullWidth
                    maxLength="3"
                    label="phone"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CallIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={userInfo.phone}
                    onChange={inputChange}
                  />
                ) : (
                  <TextField
                    error
                    id="phone"
                    margin="normal"
                    helperText="숫자만 10~11자리(ex.01012349876)로 입력해주세요"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CallIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    maxLength="3"
                    label="phone"
                    variant="outlined"
                    value={userInfo.phone}
                    onChange={inputChange}
                  />
                )}
                <Button
                  sx={{ mt: 1, mb: 2 }}
                  fullWidth
                  variant="outlined"
                  onClick={handleCancel}
                >
                  취소
                </Button>
                <LoadingButton
                  fullWidth
                  loading={loading}
                  variant="contained"
                  sx={{ mb: 2 }}
                  onClick={handleSubmit}
                >
                  회원가입
                </LoadingButton>
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default RegisterPage;
