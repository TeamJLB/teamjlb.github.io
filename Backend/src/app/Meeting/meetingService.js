const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// meeting 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const meetingProvider = require("./meetingProvider");
const meetingDao = require("./meetingDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createmeeting = async function (name, id, password, email, phone) {
    try {
        // [Validation Check]
        // 아이디 중복 확인
        const idRows = await meetingProvider.idCheck(id);
        if (idRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        // 이메일 중복 확인
        // meetingProvider에서 해당 이메일과 같은 meeting 목록을 받아서 emailRows에 저장한 후, 배열의 길이를 검사한다.
        // -> 길이가 0 이상이면 이미 해당 이메일을 갖고 있는 meeting가 조회된다는 의미
        const emailRows = await meetingProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // ------

        // 비밀번호 암호화
        // const hashedPassword = await crypto
        //     .createHash("sha512")
        //     .update(password)
        //     .digest("hex");

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        // const insertmeetingInfoParams = [name, id, hashedPassword, email, phone];
        const insertmeetingInfoParams = [name, id, password, email, phone];

        const connection = await pool.getConnection(async (conn) => conn);

        const meetingIdResult = await meetingDao.insertmeetingInfo(connection, insertmeetingInfoParams);
        console.log(`추가된 회원id : ${meetingIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createmeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (id, password) {
    try {
        // [Validation Check]
        // 닉네임 여부 확인
        const idRows = await meetingProvider.idCheck(id);
        if (idRows.length < 1) return errResponse(baseResponse.SIGNIN_NICKNAME_WRONG);

        // ------

        const selectId = idRows[0].id;
        // console.log(selectId);

        // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
        // const hashedPassword = await crypto
        //     .createHash("sha512")
        //     .update(password)
        //     .digest("hex");

        // const selectmeetingPasswordParams = [selectEmail, hashedPassword];
        const selectmeetingPasswordParams = [selectId, password];
        const passwordRows = await meetingProvider.passwordCheck(selectmeetingPasswordParams);
        // console.log(passwordRows);

        // if (passwordRows[0].password !== hashedPassword) {
        //     return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        // }
        if (passwordRows.length < 1) return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);

        // 계정 상태 확인
        const meetingInfoRows = await meetingProvider.accountCheck(id);

        if (meetingInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (meetingInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        // console.log(meetingInfoRows[0].meeting_id) // DB의 meetingId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                meetingId: meetingInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "meetingInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'meetingId': meetingInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editmeeting = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editmeetingResult = await meetingDao.updatemeetingInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editmeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}