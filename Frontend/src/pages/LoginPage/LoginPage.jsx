import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button, Typography, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import "./LoginPage.css";
import host_config from "../../config/serverHost";

const LoginPage = () => {
  const theme = createTheme();
  const [loginid, setLoginid] = useState("");
  const [loginpw, setLoginpw] = useState("");
  const [showPW, setShowPW] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = (e) => {
    setLoading(true);
    axios
      .post(
        `http://${host_config.current_host}:${host_config.current_port}/users/login`,
        {
          id: loginid,
          password: loginpw,
        }
      )
      .then(function (res) {
        console.log(res);
        if (res.status == "200") {
          console.log("code : " + res.data.code);
          switch (res.data.code) {
            case 1000: {
              const userToken = res.data.result.jwt;
              console.log(userToken);
              localStorage.setItem("refresh-token", userToken["refresh-token"]);
              if (userToken) {
                axios.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${userToken}`;
              } else {
                delete axios.defaults.headers.common["Authorization"];
              }
              navigate("/meetingList", { state: { userToken } });
              break;
            }
            case 3003: {
              alert("등록되지 않은 아이디 입니다. 아이디를 다시 확인해주세요");
              break;
            }
            case 3004: {
              alert("비밀번호를 확인해 주세요");
              break;
            }
            case 3005: {
              alert("비활성화 된 계정입니다. 고객센터에 문의해주세요.");
              break;
            }
            case 3006: {
              alert("탈퇴 된 계정입니다. 고객센터에 문의해주세요.");
              break;
            }
          }
          setLoading(false);
        } else {
          if (res.status == "400") {
            alert("회원정보를 확인해주세요");
          }
          console.log(res);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.status === "400") {
          alert("회원정보를 확인해주세요");
        }
      })
      .finally(() => {
        setLoginid("");
        setLoginpw("");
      });
  };
  const handleLoginCancel = () => {
    navigate("/");
  };
  const handleShowPW = () => {
    setShowPW(!showPW);
  };

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
            backgroundImage: 'url(https://source.unsplash.com/random)',
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
      my: 8,
      mx: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
    />
          <div className="loginForm">
            <LockOutlinedIcon />
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <TextField
              id="userid"
              margin="normal"
              label="ID"
              variant="outlined"
              required
              fullWidth
              value={loginid}
              onChange={(e) => setLoginid(e.target.value)}
            />
            <TextField
              id="userpw"
              margin="normal"
              label="Password"
              variant="outlined"
              type={showPW ? "text" : "password"}
              fullWidth
              required
              value={loginpw}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPW}>
                      {showPW ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setLoginpw(e.target.value)}
            />
            <Button
              sx={{ mt: 1, mb: 2 }}
              fullWidth
              variant="outlined"
              onClick={handleLoginCancel}
            >
              취소
            </Button>
            <LoadingButton
              fullWidth
              loading={loading}
              sx={{ mb: 2 }}
              variant="contained"
              onClick={handleLogin}
            >
              login
            </LoadingButton>
            <Link href="/register">아직 계정이 없다면? 회원가입</Link>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginPage;
