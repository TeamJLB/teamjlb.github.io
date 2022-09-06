module.exports = function(app){
    const meeting = require('./meetingController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 전체 회의 리스트 API
    app.get('/meetings/allList', jwtMiddleware, meeting.getAllMeetings);

    // 1. 유저 생성 (회원가입) API
    // app.post('/meetings/signup', meeting.postmeetings);

    // 2. 로그인 하기 (JWT 생성) API
    // app.post('/meetings/login', meeting.login);

    // 3. 중복 아이디 체크하기 API
    // app.get('/meetings', meeting.getmeetingById);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/meetings/:meetingId', jwtMiddleware, meeting.patchmeetings)

    // 유저 조회 API (+ 검색)
    // app.get('/app/meetings',meeting.getmeetings);

    // 특정 유저 조회 API
    // app.get('/app/meetings/:meetingId', meeting.getmeetingById);

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, meeting.check);

// TODO: 탈퇴하기 API