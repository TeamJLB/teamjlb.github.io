const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

const meetingProvider = require("./meetingProvider");
const meetingDao = require("./meetingDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.matchUserMeeting = async function (userIdx, meeting_id) {
    try {
        // [Validation Check]
        // 해당 회의가 db에 존재하는가?
        const meetingRow = await meetingProvider.checkMeetingById(meeting_id);
        if (meetingRow.length <= 0)
            return errResponse(baseResponse.MEETING_ID_NOT_EXISTS);
        // 이미 매칭 정보가 있는가?
        const matchRow = await meetingProvider.checkUserMeetingMatch(userIdx, meeting_id);
        if (matchRow.length > 0)
            return errResponse(baseResponse.UMMATCH_ALREADY_EXISTS);

        const connection = await pool.getConnection(async (conn) => conn);

        // 유저와 회의 매칭하기
        const createUserMeetingMatchResult = await meetingDao.insertUserMeetingMatchInfo(connection, [userIdx, meeting_id]);
        const added_umMatch_id = createUserMeetingMatchResult[0].insertId;
        console.log(`매칭된 umm_id : ${added_umMatch_id}`);

        connection.release();
        return response(baseResponse.SUCCESS, {"added_umMatch_id" : added_umMatch_id});

    } catch (err) {
        logger.error(`App - matchUserMeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.unMatchUserMeeting = async function (userIdx, meeting_id) {
    try {
        // [Validation]
        // 해당 회의 ID가 db에 없는 경우
        const meetingRow = await meetingProvider.checkMeetingById(meeting_id);
        if (meetingRow.length <= 0)
            return errResponse(baseResponse.MEETING_ID_NOT_EXISTS);
        // console.log(meetingRow)
        // 해당 회의 ID와 유저가 연결이 없는 경우 (연결이 없는 경우)
        const matchRow = await meetingProvider.checkUserMeetingMatch(userIdx, meeting_id);
        if (matchRow.length <= 0)
            return errResponse(baseResponse.UMMATCH_NOT_EXISTS);

        const connection = await pool.getConnection(async (conn) => conn);
        // [Transaction]
        try {
            // [트랜잭션 시작]
            await connection.beginTransaction();

            const deleteUserMeetingMatchResult = await meetingDao.deleteUserMeetingMatchInfo(connection, [userIdx, meeting_id]);
            // console.log(deleteUserMeetingMatchResult);

            const deleted_umMatchId_count = deleteUserMeetingMatchResult[0].affectedRows;
            // console.log(`삭제된 um매칭 수 : ${deleted_umMatchId_count}`);
            if (deleted_umMatchId_count < 1) {
                await connection.rollback();
                return errResponse(baseResponse.UMMATCH_DELETION_FAIL);
            }

            // TODO 회의에 남아있는 사람이 없으면 회의 삭제 (?)

            return response(baseResponse.SUCCESS);
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
        logger.error(`App - unMatchUserMeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.addNewMeeting = async function (userIdx, meeting_name) {
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

            // -- (deprecated) --
            // 새로 만든 회의의 첫 주제 입력하기
            // const createSubMeetingResult = await meetingDao.insertSubMeetingInfo(connection, [added_meeting_id, first_topic]);
            // const added_subMeeting_id = createSubMeetingResult[0].insertId;
            // console.log(`추가된 주제 id : ${added_subMeeting_id}`);

            // 서브 회의와 회원 매칭하기
            // const matchMeetingWithUser = await meetingDao.makeMatching(connection, [userIdx, added_subMeeting_id]);
            // const added_match_id = matchMeetingWithUser[0].insertId;
            // console.log(`매칭된 id : ${added_match_id}`);
            // ----
            // 개설자(회원)와 회의 매칭하기
            const matchMeetingWithUser = await meetingDao.insertUserMeetingMatchInfo(connection, [userIdx, added_meeting_id]);
            const added_umMatch_id = matchMeetingWithUser[0].insertId;
            console.log(`매칭된 umm_id : ${added_umMatch_id}`);

            // [정상적으로 처리되면 트랜잭션 완료]
            await connection.commit();
            return response(baseResponse.SUCCESS, {"added_meeting_id" : added_meeting_id, "added_umMatch_id" : added_umMatch_id});
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

exports.enterMeeting = async function (userIdx, meeting_id) {
    try {
        // [Validation]
        let previous_match_id = null;
        let previous_match_status = null;

        // 개설된 서브회의가 있는가? (있다면 sub_meeting_id 반환, 없다면 null 반환)
        const subMeetingRow = await meetingProvider.checkOpenSubMeetingById(meeting_id);
        const openSubMeetingId = subMeetingRow.latest_sub_meeting_id;
        // console.log(openSubMeetingId);
        if (openSubMeetingId != null){
            console.log(`회의에 입장합니다.`);
            // 서브회의에 참여한 적이 있는가? (있다면 match_id 반환, 없다면 null 반환)
            const matchRow = await meetingProvider.checkPreviousMatchingById(userIdx, openSubMeetingId);
            // console.log(matchRow);
            if (matchRow.length <= 0) {
                console.log(`회의에 새로 입장합니다.`);
            } else {
                console.log(`회의에 다시 입장합니다.`);
                previous_match_id = matchRow[0].previous_match_id;
                previous_match_status = matchRow[0].status;
                // console.log(previous_match_id, previous_match_status);
                // 매칭 상태가 이미 연결되어 있는가?
                if (previous_match_status == 'active') {
                    return errResponse(baseResponse.MATCHING_ALREADY_EXISTS);
                }
            }

            // (match status 신경 안 쓴다면 아래 방식이 더 좋음)
            // previous_match_id = matchRow.previous_match_id;
            // // console.log(previous_match_id);
            // if (previous_match_id != null) {
            //     console.log(`회의에 다시 입장합니다.`);
            // } else {
            //     console.log(`회의에 새로 입장합니다.`);
            // }
        } else {
            console.log('회의를 개설합니다.');
        }

        const connection = await pool.getConnection(async (conn) => conn);

        // [Transaction]
        try {
            // [트랜잭션 시작]
            await connection.beginTransaction();
            // CASE 1 - 서브회의를 새로 개설하는 경우
            if (openSubMeetingId == null) {
                // 새 서브회의 개설
                const createSubMeetingResult = await meetingDao.insertSubMeetingInfo(connection, meeting_id);
                const added_subMeeting_id = createSubMeetingResult[0].insertId;
                console.log(`추가된 서브회의 id : ${added_subMeeting_id}`);

                // 서브 회의와 회원 매칭하기
                const matchSubMeetingWithUser = await meetingDao.makeMatching(connection, [userIdx, added_subMeeting_id]);
                const added_match_id = matchSubMeetingWithUser[0].insertId;
                console.log(`매칭된 id : ${added_match_id}`);

                // [정상적으로 처리되면 트랜잭션 완료]
                await connection.commit();
                return response(baseResponse.SUCCESS, {"action": "회의를 개설합니다.", "added_subMeeting_id": added_subMeeting_id, "added_match_id" : added_match_id});
            }

            // CASE 2 - 열려있는 서브회의에 새로 참여하는 경우
            else if (openSubMeetingId != null && previous_match_id == null) {
                // 서브 회의와 회원 매칭하기
                const matchSubMeetingWithUser = await meetingDao.makeMatching(connection, [userIdx, openSubMeetingId]);
                const added_match_id = matchSubMeetingWithUser[0].insertId;
                console.log(`매칭된 id : ${added_match_id}`);

                // [정상적으로 처리되면 트랜잭션 완료]
                await connection.commit();
                return response(baseResponse.SUCCESS, {"action": "회의에 참가합니다.", "opened_subMeeting_id": openSubMeetingId, "added_match_id" : added_match_id});
            }

            // CASE 3 - 열려있는 서브회의에 다시 참여하는 경우
            else if (openSubMeetingId != null && previous_match_id != null) {
                const updateMatchStatus = await meetingDao.updateMatchingToActiveById(connection, previous_match_id);
                console.log(updateMatchStatus);
                console.log(`갱신된 매칭id : ${previous_match_id}`);

                // [정상적으로 처리되면 트랜잭션 완료]
                await connection.commit();
                return response(baseResponse.SUCCESS, {"action": "회의에 재입장합니다.", "opened_subMeeting_id": openSubMeetingId, "updated_match_id" : previous_match_id});
            }

            // [나머지 경우에 트랜잭션 처리 -> 실패]
            await connection.rollback();
            return errResponse(baseResponse.ENTER_MEETING_FAILED);
        } catch (err) {
            // [비정상적으로 처리되면 트랜잭션 롤백]
            await connection.rollback();
            console.log(err);
            return errResponse(baseResponse.TRANSACTION_ERROR);
        } finally {
            // [연결 해제]
            // console.log('여기까지 와..? -> 오넹!');
            connection.release();
        }
    } catch (err) {
        logger.error(`App - enterMeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.exitMeeting = async function (userIdx, meeting_id, sub_meeting_id, match_id) {
    try {
        // [Validation]
        // 회의id와 서브회의id가 유효한가? (잘 매칭되는가?)
        const meetingIdResult = await meetingProvider.checkMeetingBySubId(sub_meeting_id);
        // console.log(meetingIdResult);
        if (meeting_id != meetingIdResult.meeting_id){
            return errResponse(baseResponse.MEETING_SUBMEETING_VALIDATION_FAIL);
        }
        // 회의와 매칭 정보가 올바른가?
        const checkMatchValidationResult = await meetingProvider.checkMeetingMatchingValidation(meeting_id, match_id);
        // console.log(checkMatchValidationResult);
        if (checkMatchValidationResult.validation_result == 0) {
            return errResponse(baseResponse.MEETING_MATCH_VALIDATION_FAIL);
        }

        // 매칭이 현재 닫을 수 있는 상태인가? (=active 인가)
        const checkExitableMatchResult = await meetingProvider.checkActiveMatchingById(match_id);
        // console.log(checkExitableMatchResult);
        if (checkExitableMatchResult.match_result == 0) {
            return errResponse(baseResponse.MATCHING_CLOSE_NOT_READY);
        }

        const connection = await pool.getConnection(async (conn) => conn);

        // 매칭상태 inactive으로 변경
        const updateMatchStatus = await meetingDao.updateMatchingToInactiveById(connection, match_id);
        // console.log(updateMatchStatus);

        // 서브회의가 완전히 종료됐는지 확인 (해당 서브회의의 모든 매칭상태를 확인하여 연결된 사람이 있는지 확인)
        const activeMatchResult = await meetingProvider.checkLeftMatchById(sub_meeting_id);
        // console.log(activeMatchResult);

        // [Transaction]
        try {
            // [트랜잭션 시작]
            await connection.beginTransaction();

            // 서브회의에 남아있는 참가자 유무에 따라
            if (activeMatchResult.left_match_result == 0) {
                // 서브회의 종료
                const closeSubMeetingResult = await meetingDao.updateSubMeetingStatus(connection, sub_meeting_id);
                // console.log(closeSubMeetingResult);

                // 매칭 정보 종료로 변경
                const terminateMatchingsResult = await meetingDao.updateAllMatchingStatus(connection, sub_meeting_id);
                // console.log(terminateMatchingsResult);

                // [정상적으로 처리되면 트랜잭션 완료]
                await connection.commit();
                return response(baseResponse.SUCCESS, {"updated_match_id" : match_id, "terminated_sub_meeting_id" : sub_meeting_id});
            } else {
                // [정상적으로 처리되면 트랜잭션 완료]
                await connection.commit();
                return response(baseResponse.SUCCESS, {"updated_match_id" : match_id});
            }
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
        logger.error(`App - exitMeeting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateSubMeetingTopic = async function (userIdx, meeting_id, sub_meeting_id, topic) {
    try {
        // [Validation Check]
        let previous_topic = null;
        // 회의id와 서브회의id가 유효한가? (잘 매칭되는가?)
        const meetingIdResult = await meetingProvider.checkMeetingBySubId(sub_meeting_id);
        // console.log(meetingIdResult);
        if (meeting_id != meetingIdResult.meeting_id){
            return errResponse(baseResponse.MEETING_SUBMEETING_VALIDATION_FAIL);
        }

        const connection = await pool.getConnection(async (conn) => conn);

        // [Transaction]
        try {
            // [트랜잭션 시작]
            await connection.beginTransaction();

            // 해당 서브회의의 기존 주제 가져오기
            const getSubMeetingTopicResult = await meetingProvider.checkSubMeetingTopicById(sub_meeting_id);
            previous_topic = getSubMeetingTopicResult.topic;
            // console.log(previous_topic);

            // 서브회의 주제 갱신하기 (기존 주제랑 다른 경우만)
            if (previous_topic != topic) {
                const updateSubMeetingTopicResult = await meetingDao.updateSubMeetingTopic(connection, [topic, sub_meeting_id]);
                // console.log(updateSubMeetingTopicResult);
            }

            // [정상적으로 처리되면 트랜잭션 완료]
            await connection.commit();
            return response(baseResponse.SUCCESS, {"previous_topic" : previous_topic, "updated_topic" : topic});
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
        logger.error(`App - updateSubMeetingTopic Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// (deprecated)
// exports.joinNewMeeting = async function (userIdx, meeting_id) {
//     try {
//         // [Validation]
//         // 해당 회의 ID가 db에 없는 경우
//         const meetingRow = await meetingProvider.checkMeetingById(meeting_id);
//         if (meetingRow.length <= 0)
//             return errResponse(baseResponse.MEETING_ID_NOT_EXISTS);
//         // console.log(meetingRow)
//         // ---
//
//         const connection = await pool.getConnection(async (conn) => conn);
//
//         // [Transaction]
//         try {
//             // [트랜잭션 시작]
//             await connection.beginTransaction();
//
//             // 회의 id로 가장 최신 서브회의 id 찾기
//             const getSubMeetingIdResult = await meetingDao.selectSubMeetingById(connection, meeting_id);
//             const latest_sub_meeting_id = getSubMeetingIdResult[0].latest_sub_meeting_id;
//             // console.log(latest_sub_meeting_id);
//
//             // 서브 회의와 회원 매칭하기
//             const matchMeetingWithUser = await meetingDao.makeMatching(connection, [userIdx, latest_sub_meeting_id]);
//             const added_match_id = matchMeetingWithUser[0].insertId;
//             console.log(`added_match_id : ${added_match_id}`);
//
//             // [정상적으로 처리되면 트랜잭션 완료]
//             await connection.commit();
//             return response(baseResponse.SUCCESS, {"added_match_id" : added_match_id});
//         } catch (err) {
//             // [비정상적으로 처리되면 트랜잭션 롤백]
//             await connection.rollback();
//             console.log(err);
//             return errResponse(baseResponse.TRANSACTION_ERROR);
//         } finally {
//             // [연결 해제]
//             connection.release();
//         }
//     } catch (err) {
//         logger.error(`App - joinNewMeeting Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// }
