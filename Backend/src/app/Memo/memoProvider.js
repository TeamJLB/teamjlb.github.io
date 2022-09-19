const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const memoDao = require("./memoDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveMemo = async function (userIdx, sub_meeting_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const memoResult = await memoDao.selectMemoById(connection, sub_meeting_id);

    connection.release();

    return response(baseResponse.SUCCESS, memoResult);
};

exports.retrieveAllMemoById = async function (userIdx, meeting_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const allMemoListResult = await memoDao.selectAllMemoById(connection, meeting_id);
    // connection 해제
    connection.release();

    return response(baseResponse.SUCCESS, allMemoListResult);
};
