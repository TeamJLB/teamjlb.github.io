const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}
exports.getTestDB = async function (req, res) {
    const testResponse = await userProvider.retrieveAllUser()
    return res.send(testResponse)
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/signup
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: name, id, password, email, phone
     */
    const {name, id, password, email, phone} = req.body;

    // [Validation Check]
    // 빈 값 체크
    if (!name || !id || !password || !email)
        return res.send(response(baseResponse.SIGNUP_EMPTY));

    // 이메일 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 이메일 길이 체크
    // if (email.length > 30)
    //     return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // ------

    // createUser 함수 실행을 통한 결과 값을 signUpResponse에 저장
    const signUpResponse = await userService.createUser(name, id, password, email, phone);

    // signUpResponse 값을 json으로 전달
    return res.send(signUpResponse);
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

    const signInResponse = await userService.postSignIn(id, password);

    return res.send(signInResponse);
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API (중복체크)
 * [GET] /app/users
 */
exports.getUserById = async function (req, res) {

    /**
     * Query String: id
     */
    const userId = req.query.id;

    // errResponse 전달
    if (!userId) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    // userId를 통한 유저 검색 함수 호출 및 결과 저장
    const checkUserIdResponse = await userProvider.retrieveUser(userId);
    return res.send(checkUserIdResponse);
};

/**
 * API No. 4
 * API Name : 로그인한 회원 정보 불러오기 API
 * [GET] /app/users/userInfo
 */
exports.getUser = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    // userId를 통한 유저 검색 함수 호출 및 결과 저장
    const userInfoListResponse = await userProvider.retrieveUserList(userIdxFromJWT);
    return res.send(userInfoListResponse);
};


/**
 * API No.
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
// exports.getUsers = async function (req, res) {

//     /**
//      * Path Variable: email
//      */
//     const email = req.params.email;

//     if (!email) {
//         // 유저 전체 조회
//         const userListResult = await userProvider.retrieveUserList();
//         // SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" }, 메세지와 함께 userListResult 호출
//         return res.send(response(baseResponse.SUCCESS, userListResult));
//     } else {
//         // 아메일을 통한 유저 검색 조회
//         const userListByEmail = await userProvider.retrieveUserList(email);
//         return res.send(response(baseResponse.SUCCESS, userListByEmail));
//     }
// };

/**
 * API No.
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
// exports.patchUsers = async function (req, res) {

//     // jwt - userId, path variable :userId

//     const userIdFromJWT = req.verifiedToken.userId

//     const userId = req.params.userId;
//     const nickname = req.body.nickname;

//     // JWT는 이 후 주차에 다룰 내용
//     if (userIdFromJWT != userId) {
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//     } else {
//         if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

//         const editUserInfo = await userService.editUser(userId, nickname)
//         return res.send(editUserInfo);
//     }
// };

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
