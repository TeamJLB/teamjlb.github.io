const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

const meetingProvider = require("./meetingProvider");
const meetingDao = require("./meetingDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.addNewMeeting = async function (userIdx, meeting_name, first_topic) {
    try {
        // [Validation Check]
        // 회의 이름 중복 확인
        // const meetingRows = await meetingProvider.meetingCheck(meeting_name);
        // if (meetingRows.length > 0)
        //     return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        // const insertMeetingInfoParams = [userIdx, meeting_name, first_topic];

        const connection = await pool.getConnection(async (conn) => conn);

        // [Transaction]
        try {
            // [트랜잭션 시작]
            await connection.beginTransaction();

            // 새 회의 개설
            const createMeetingResult = await meetingDao.insertMeetingInfo(connection, meeting_name);
            const added_meeting_id = createMeetingResult[0].insertId;
            console.log(`추가된 회의 id : ${added_meeting_id}`);

            // 새로 만든 회의의 첫 주제 입력하기
            const createSubMeetingResult = await meetingDao.insertSubMeetingInfo(connection, [added_meeting_id, first_topic]);
            const added_subMeeting_id = createSubMeetingResult[0].insertId;
            console.log(`추가된 주제 id : ${added_subMeeting_id}`);

            // 서브 회의와 회원 매칭하기
            const matchMeetingWithUser = await meetingDao.makeMatching(connection, [userIdx, added_subMeeting_id]);
            const added_match_id = matchMeetingWithUser[0].insertId;
            console.log(`매칭된 id : ${added_match_id}`);

            // [정상적으로 처리되면 트랜잭션 완료]
            await connection.commit();
            return response(baseResponse.SUCCESS, {"added_meeting_id" : added_meeting_id, "added_subMeeting_id" : added_subMeeting_id, "added_match_id" : added_match_id});
        } catch (err) {
            // [비정상적으로 처리되면 트랜잭션 롤백]
            await connection.rollback();
            console.log(err);
            return errResponse(baseResponse.TRANSACTION_ERROR);
        } finally {
            // [연결 해제]
            connection.release();
        }
    } catch (err) {
        logger.error(`App - addNewMeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.addNewSubMeeting = async function (userIdx, meeting_id, new_topic) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        // [Transaction]
        try {
            // [트랜잭션 시작]
            await connection.beginTransaction();

            // 기존 회의에서 새로운 주제로 새 서브회의 개설
            const createSubMeetingResult = await meetingDao.insertSubMeetingInfo(connection, [meeting_id, new_topic]);
            const added_subMeeting_id = createSubMeetingResult[0].insertId;
            console.log(`추가된 서브회의 id : ${added_subMeeting_id}`);

            // 서브 회의와 회원 매칭하기
            const matchMeetingWithUser = await meetingDao.makeMatching(connection, [userIdx, added_subMeeting_id]);
            const added_match_id = matchMeetingWithUser[0].insertId;
            console.log(`매칭된 id : ${added_match_id}`);

            // [정상적으로 처리되면 트랜잭션 완료]
            await connection.commit();
            return response(baseResponse.SUCCESS, {"added_subMeeting_id": added_subMeeting_id, "added_match_id" : added_match_id});
        } catch (err) {
            // [비정상적으로 처리되면 트랜잭션 롤백]
            await connection.rollback();
            console.log(err);
            return errResponse(baseResponse.TRANSACTION_ERROR);
        } finally {
            // [연결 해제]
            connection.release();
        }
    } catch (err) {
        logger.error(`App - addNewMeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.joinNewMeeting = async function (userIdx, meeting_id) {
    try {
        // [Validation]
        // 해당 회의 ID가 db에 없는 경우
        const meetingRow = await meetingProvider.meetingCheckById(meeting_id);
        if (meetingRow.length <= 0)
            return errResponse(baseResponse.MEETING_ID_NOT_EXISTS);
        // console.log(meetingRow)
        // ---

        const connection = await pool.getConnection(async (conn) => conn);

        // [Transaction]
        try {
            // [트랜잭션 시작]
            await connection.beginTransaction();

            // 회의 id로 가장 최신 서브회의 id 찾기
            const getSubMeetingIdResult = await meetingDao.selectSubMeetingById(connection, meeting_id);
            const latest_sub_meeting_id = getSubMeetingIdResult[0].latest_sub_meeting_id;
            // console.log(latest_sub_meeting_id);

            // 서브 회의와 회원 매칭하기
            const matchMeetingWithUser = await meetingDao.makeMatching(connection, [userIdx, latest_sub_meeting_id]);
            const added_match_id = matchMeetingWithUser[0].insertId;
            console.log(`added_match_id : ${added_match_id}`);

            // [정상적으로 처리되면 트랜잭션 완료]
            await connection.commit();
            return response(baseResponse.SUCCESS, {"added_match_id" : added_match_id});
        } catch (err) {
            // [비정상적으로 처리되면 트랜잭션 롤백]
            await connection.rollback();
            console.log(err);
            return errResponse(baseResponse.TRANSACTION_ERROR);
        } finally {
            // [연결 해제]
            connection.release();
        }
    } catch (err) {
        logger.error(`App - joinNewMeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteMeeting = async function (userIdx, meeting_id) {
    try {
        // [Validation]
        // 해당 회의 ID가 db에 없는 경우
        const meetingRow = await meetingProvider.meetingCheckById(meeting_id);
        if (meetingRow.length <= 0)
            return errResponse(baseResponse.MEETING_ID_NOT_EXISTS);
        // console.log(meetingRow)

        // 해당 회의 ID와 유저가 연결이 없는 경우 (연결이 없는 경우)

        // ---
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteMatchingResult = await meetingDao.deleteAllMatchingIds(connection, [userIdx, meeting_id]);
        // console.log(deleteMatchingResult);
        const deleted_matchId_count = deleteMatchingResult[0].affectedRows;
        // console.log(`삭제된 매칭id 수 : ${deleted_matchId_count}`);

        // 삭제된 열이 없는 경우 (매칭 정보가 없는 경우)
        if (deleted_matchId_count > 0) {
            return response(baseResponse.SUCCESS);
        } else {
            return errResponse(baseResponse.MEETING_NO_MATCHING);
        }

        connection.release();
    } catch (err) {
        logger.error(`App - deleteMeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}