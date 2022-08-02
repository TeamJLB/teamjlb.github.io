module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest)
    app.get('/app/testdb', user.getTestDB)

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users/signup', user.postUsers);

    // 2. 로그인 하기 (JWT 생성) API
    app.post('/app/users/login', user.login);

    // 3. 중복 아이디 체크하기 API
    app.get('/app/users', user.getUserById);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

    // 유저 조회 API (+ 검색)
    // app.get('/app/users',user.getUsers);

    // 특정 유저 조회 API
    // app.get('/app/users/:userId', user.getUserById);

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API