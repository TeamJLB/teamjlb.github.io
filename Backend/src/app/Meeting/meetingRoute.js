module.exports = function(app){
    const meeting = require('./meetingController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 전체 회의 리스트 API
    app.get('/meetings/allList', jwtMiddleware, meeting.getAllMeetings);

    // 2. 본인이 속한 회의 검색어로 검색 API
    app.get('/meetings/myMeeting', jwtMiddleware, meeting.getMeetingById);

    // 3. meeting_id로 회의 검색 API
    app.get('/meetings/search/:meetingId', jwtMiddleware, meeting.getSortedMeetingById);

    // 4. 회의를 내 회의 리스트에 추가하기 API
    app.post('/meetings/myMeeting/:meetingId', jwtMiddleware, meeting.postNewMeetingMatch);

    // 5. 새 회의 개설 API
    app.post('/meetings/newMeeting', jwtMiddleware, meeting.postNewMeeting);

    // 6. 회의를 내 회의 리스트에서 제거하기 API
    app.delete('/meetings/myMeeting/:meetingId', jwtMiddleware, meeting.deleteMyMeeting);

    // 7. 회의에 입장하기 API
    app.post('/meetings/openMeeting/:meetingId', jwtMiddleware, meeting.postEnterMeeting);

    // (dept)4. 기존 회의 다시 개설 API
    // (dept)5. 새 회의 참가 API
    // app.post('/meetings/newMeeting/:meetingId', jwtMiddleware, meeting.joinNewMeeting);

    // TODO 서브회의 퇴장하기부터

    // 7. 회의 히스토리 리스트 API
    app.get('/meetings/meetingHistory', jwtMiddleware, meeting.getSubMeetingHistoryById);
};