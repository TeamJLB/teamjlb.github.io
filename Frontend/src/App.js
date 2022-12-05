import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MeetingListPage } from "./pages/MeetingListPage";
import { HistoryPage } from "./pages/HistoryPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { MeetingRoomPage } from "./pages/MeetingRoomPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Sidebar from "./components/UI/Sidebar";
import LogoutBtn from './components/UI/LogoutBtn';

const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans CJK KR",
    fontStyle: "normal",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meetingList" element={<MeetingListPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/meetingRoom" element={<MeetingRoomPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
