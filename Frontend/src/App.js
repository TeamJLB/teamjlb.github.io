import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MeetingListPage } from "./pages/MeetingListPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/meetingList" element={<MeetingListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
