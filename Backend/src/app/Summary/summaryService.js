const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

const summaryProvider = require("./summaryProvider");
const summaryDao = require("./summaryDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

exports.addSummary = async function (userIdx, match_id, summary_content, original_content) {
    try {
        // [Validation Check]
        // 매칭 ID 존재 여부 확인
        const matchRow = await summaryProvider.matchingCheck(match_id);
        if (matchRow.length <= 0)
            return errResponse(baseResponse.MATCHING_NO_RESULT);

        const connection = await pool.getConnection(async (conn) => conn);
        const addSummaryResult = await summaryDao.insertSummaryInfo(connection, [match_id, summary_content, original_content]);
        // const added_summary_id = addSummaryResult[0].insertId;
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - addSummary Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.changeSummary = async function (userIdx, match_id, summary_content) {
    try {
        // [Validation Check]
        // 매칭 ID 존재 여부 확인
        const matchRow = await summaryProvider.matchingCheck(match_id);
        if (matchRow.length <= 0)
            return errResponse(baseResponse.MATCHING_NO_RESULT);

        const connection = await pool.getConnection(async (conn) => conn);
        const changeSummaryResult = await summaryDao.updateSummaryInfo(connection, [summary_content, match_id]);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - changeSummary Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
