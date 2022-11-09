const jwtMiddleware = require("../../../config/jwtMiddleware");
const meeting = require("./meetingController");
module.exports = function(app){
    const meeting = require('./meetingController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 전체 회의 리스트 API
    app.get('/meetings/allList', jwtMiddleware, meeting.getAllMeetings);

    // 2. 본인이 속한 회의 검색어로 찾기 API
    app.get('/meetings/myMeeting', jwtMiddleware, meeting.getMeetingById);

    // 3. meeting_id로 회의 검색 API
    app.get('/meetings/search/:meetingId', jwtMiddleware, meeting.getSortedMeetingById);

    // 4. 회의를 내 회의 리스트에 추가하기 API
    app.post('/meetings/myMeeting/:meetingId', jwtMiddleware, meeting.postNewMeetingMatch);

    // 5. 새 회의 개설 API
    app.post('/meetings/newMeeting', jwtMiddleware, meeting.postNewMeeting);

    // 6. 회의를 내 회의 리스트에서 제거하기 API
    app.delete('/meetings/myMeeting/:meetingId', jwtMiddleware, meeting.deleteMyMeeting);

    // 7. (서브)회의에 입장하기 API
    app.post('/meetings/openMeeting/:meetingId', jwtMiddleware, meeting.postEnterMeeting);

    // 8. (서브)회의에서 퇴장하기 API (퇴장 시, 모든 사람이 다 나오면 회의 종료)
    app.patch('/meetings/closeMeeting/:meetingId/:subMeetingId', jwtMiddleware, meeting.patchExitMeeting);

    // 9. (서브)회의 주제 갱신(저장)하기 API
    app.patch('/meetings/openMeeting/:meetingId/:subMeetingId', jwtMiddleware, meeting.patchSubMeetingTopic);

    // 10. 회의 히스토리 리스트 API
    app.get('/meetings/meetingHistory', jwtMiddleware, meeting.getSubMeetingHistoryById);

};