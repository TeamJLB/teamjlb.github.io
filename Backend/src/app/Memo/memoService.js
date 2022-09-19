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
        const connection = await pool.getConnection(async (conn) => conn);

        const insertMemoResult = await memoDao.insertMemoInfo(connection, [sub_meeting_id, memo_content]);
        const added_memo_id = insertMemoResult[0].insertId;

        connection.release();

        return response(baseResponse.SUCCESS, {"added_memo_id" : added_memo_id});

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
