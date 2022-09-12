module.exports = function(app){
    const meeting = require('./meetingController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 전체 회의 리스트 API
    app.get('/meetings/allList', jwtMiddleware, meeting.getAllMeetings);

    // 2. 본인이 속한 회의 검색 API
    app.get('/meetings/myMeeting', jwtMiddleware, meeting.getMeetingById);

    // 3. 새 회의 개설 API
    app.post('/meetings/newMeeting', jwtMiddleware, meeting.postNewMeeting);

    // 4. 새 회의 참가 API
    app.post('/meetings/newMeeting/:meetingId', jwtMiddleware, meeting.joinNewMeeting);

    // 5. 회의 삭제

};