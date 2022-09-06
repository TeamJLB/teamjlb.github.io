const jwtMiddleware = require("../../../config/jwtMiddleware");
const meetingProvider = require("../../app/Meeting/meetingProvider");
const meetingService = require("../../app/Meeting/meetingService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

/**
 * API No. 1
 * API Name : 전체 회의 리스트 API
 * [GET] /meetings/allList
 */
exports.getAllMeetings = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id
    // 로그인 아이디 확인
    // console.log(userIdxFromJWT);
    // return res.send(response(baseResponse.SUCCESS, {'verified_user_id' : userIdxFromJWT}));


    /**
     * Body: name, id, password, email, phone
     */
    // const {name, id, password, email, phone} = req.body;
    //
    // // [Validation Check]
    // // 빈 값 체크
    // if (!name || !id || !password || !email)
    //     return res.send(response(baseResponse.SIGNUP_EMPTY));
    //
    // // 이메일 형식 체크 (by 정규표현식)
    // if (!regexEmail.test(email))
    //     return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 이메일 길이 체크
    // if (email.length > 30)
    //     return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // ------

    // createmeeting 함수 실행을 통한 결과 값을 signUpResponse에 저장
    // const signUpResponse = await meetingService.createmeeting(name, id, password, email, phone);
    //
    // // signUpResponse 값을 json으로 전달
    return res.send(signInResponse);
};

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /app/login
 * body : id, passsword
 */
exports.login = async function (req, res) {

    const {id, password} = req.body;

    const signInResponse = await meetingService.postSignIn(id, password);

    return res.send(signInResponse);
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API (중복체크)
 * [GET] /app/meetings
 */
exports.getmeetingById = async function (req, res) {

    /**
     * Query String: id
     */
    const meetingId = req.query.id;

    // errResponse 전달
    if (!meetingId) return res.send(errResponse(baseResponse.meeting_NICKNAME_EMPTY));

    // meetingId를 통한 유저 검색 함수 호출 및 결과 저장
    const checkmeetingIdResponse = await meetingProvider.retrievemeeting(meetingId);
    return res.send(checkmeetingIdResponse);
};


/**
 * API No.
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/meetings
 */
exports.getmeetings = async function (req, res) {

    /**
     * Path Variable: email
     */
    const email = req.params.email;

    if (!email) {
        // 유저 전체 조회
        const meetingListResult = await meetingProvider.retrievemeetingList();
        // SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" }, 메세지와 함께 meetingListResult 호출
        return res.send(response(baseResponse.SUCCESS, meetingListResult));
    } else {
        // 아메일을 통한 유저 검색 조회
        const meetingListByEmail = await meetingProvider.retrievemeetingList(email);
        return res.send(response(baseResponse.SUCCESS, meetingListByEmail));
    }
};


/**
 * API No.
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/meetings/:meetingId
 * path variable : meetingId
 * body : nickname
 */
exports.patchmeetings = async function (req, res) {

    // jwt - meetingId, path variable :meetingId

    const meetingIdFromJWT = req.verifiedToken.meetingId

    const meetingId = req.params.meetingId;
    const nickname = req.body.nickname;

    // JWT는 이 후 주차에 다룰 내용
    if (meetingIdFromJWT != meetingId) {
        res.send(errResponse(baseResponse.meeting_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.meeting_NICKNAME_EMPTY));

        const editmeetingInfo = await meetingService.editmeeting(meetingId, nickname)
        return res.send(editmeetingInfo);
    }
};

/** JWT 토큰 검증 API
 * [GET] /auto-login
 */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };
