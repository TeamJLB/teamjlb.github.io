const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const summaryDao = require("./summaryDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveSummary = async function (userIdx, sub_meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const summaryResult = await summaryDao.selectSummaryById(connection, sub_meeting_id);

  connection.release();

  return response(baseResponse.SUCCESS, summaryResult);
};

exports.matchingCheck = async function (match_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const matchCheckResult = await summaryDao.findMatchingById(connection, match_id);
  connection.release();

  return matchCheckResult;
};
