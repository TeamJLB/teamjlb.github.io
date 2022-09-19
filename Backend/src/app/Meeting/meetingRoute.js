module.exports = function(app){
    const meeting = require('./meetingController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 전체 회의 리스트 API
    app.get('/meetings/allList', jwtMiddleware, meeting.getAllMeetings);

    // 2. 본인이 속한 회의 검색 API
    app.get('/meetings/myMeeting', jwtMiddleware, meeting.getMeetingById);

    // 3. 새 회의 개설 API
    app.post('/meetings/newMeeting', jwtMiddleware, meeting.postNewMeeting);

    // TODO 회의가 열려있는지 확인하고, 안 열려있으면 새로 만들고, 열려있으면 참가
    // 4. 기존 회의 다시 개설 API
    app.post('/meetings/openMeeting/:meetingId', jwtMiddleware, meeting.postNewSubMeeting);

    // 5. 새 회의 참가 API
    app.post('/meetings/newMeeting/:meetingId', jwtMiddleware, meeting.joinNewMeeting);

    // 6. 회의 삭제 API
    app.delete('/meetings/myMeeting/:meetingId', jwtMiddleware, meeting.deleteMeeting);

    // 7. 회의 히스토리 리스트 API
    app.get('/meetings/meetingHistory', jwtMiddleware, meeting.getSubMeetingHistoryById);
};