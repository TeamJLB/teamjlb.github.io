const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

const memoProvider = require("./memoProvider");
const memoDao = require("./memoDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.addNewMemo = async function (userIdx, sub_meeting_id, memo_content) {
    try {
        // [Validation]
        // 해당 서브회의가 존재하는가 (아직 회의중인)
        const subMeetingRow = await memoProvider.checkSubMeeting(sub_meeting_id);
        // console.log(subMeetingRow);
        if (subMeetingRow.length <= 0){
            return errResponse(baseResponse.MEMO_NO_OPEN_SUBMEETING);
        }

        // 이미 메모가 작성되어 있는가 (처음 메모를 저장하는것인가) - 없다면 새로 저장, 있다면 업데이트
        const memoRow = await memoProvider.checkMemo(sub_meeting_id);
        // console.log(memoRow);
        // 새로운 메모인 경우 그냥 추가
        if (memoRow.length <= 0) {
            const connection = await pool.getConnection(async (conn) => conn);
    
            const insertMemoResult = await memoDao.insertMemoInfo(connection, [sub_meeting_id, memo_content]);
            const added_memo_id = insertMemoResult[0].insertId;
    
            connection.release();
    
            return response(baseResponse.SUCCESS, {"added_memo_id" : added_memo_id});
        } 
        // 기존 메모가 있는 경우, 기존 메모와 새 메모 비교
        else {
            prevMemoInfo = memoRow[0];
            prev_memo_id = prevMemoInfo.memo_id;
            prev_memo_content = prevMemoInfo.memo_content;
            // 같으면 아무 작업도 하지 않기
            if (prev_memo_content == memo_content) {
                return response(baseResponse.SUCCESS, {"action" : "내용이 같아 아무 작업도 하지 않습니다."})
            }
            // 다르면 업데이트하기
            else {
                const connection = await pool.getConnection(async (conn) => conn);
    
                const patchMemoResult = await memoDao.updateMemoInfo(connection, [memo_content, sub_meeting_id]);
        
                connection.release();
        
                return response(baseResponse.SUCCESS, {"updated_memo_id" : prev_memo_id});
            }
        }
    } catch (err) {
        logger.error(`App - addNewMemo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.changeMemo = async function (userIdx, sub_meeting_id, memo_content) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const patchMemoResult = await memoDao.updateMemoInfo(connection, [memo_content, sub_meeting_id]);
        // console.log(patchMemoResult[0]);

        connection.release();

        // return response(baseResponse.SUCCESS, {"added_memo_id" : added_memo_id});
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - changeMemo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.addKeywords = async function (userIdx, memo_id, keywords) {
    try {
        // 키워드들 분리
        keyword_list = keywords.split(', ');
        console.log(keyword_list);

        // TODO 트랜잭션을 할지 안할지 아직 모름
        const connection = await pool.getConnection(async (conn) => conn);
        const added_keyword_id_list = []

        // 키워드 개수만큼 추가하기
        for (const keyword of keyword_list) {
            const insertKeywordResult = await memoDao.insertKeywordInfo(connection, [memo_id, keyword]);
            const added_keyword_id = insertKeywordResult[0].insertId
            console.log(`${added_keyword_id} : ${keyword}`);
            added_keyword_id_list.push(added_keyword_id);
        }

        connection.release();

        return response(baseResponse.SUCCESS, {"added_keyword_id_list" : added_keyword_id_list});

    } catch (err) {
        logger.error(`App - addNewMemo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
