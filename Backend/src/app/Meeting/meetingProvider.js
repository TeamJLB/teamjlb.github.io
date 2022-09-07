const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const meetingDao = require("./meetingDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveAllMeeting = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const allMeetingListResult = await meetingDao.selectAllMeetingByUserId(connection, userIdx);
  // connection 해제
  connection.release();

  return allMeetingListResult;
};

exports.retrievemeeting = async function (meetingId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const meetingResult = await meetingDao.selectmeetingId(connection, meetingId);

  connection.release();

  if (meetingResult.length > 0)
    return response(baseResponse.SUCCESS, {'unique': false});
  else
    return response(baseResponse.SUCCESS, {'unique': true});

  // return meetingResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.retrievemeetingList = async function (email) {

  //email을 인자로 받는 경우와 받지 않는 경우를 구분하여 하나의 함수에서 두 가지 기능을 처리함

  if (!email) {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    // Dao 쿼리문의 결과를 호출
    const meetingListResult = await meetingDao.selectmeeting(connection);
    // connection 해제
    connection.release();

    return meetingListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const meetingListResult = await meetingDao.selectmeetingEmail(connection, email);
    connection.release();

    return meetingListResult;
  }
};

exports.idCheck = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const idCheckResult = await meetingDao.selectmeetingId(connection, id);
  connection.release();

  return idCheckResult;
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await meetingDao.selectmeetingEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectmeetingPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  // 쿼리문에 여러개의 인자를 전달할 때 selectmeetingPasswordParams와 같이 사용합니다.
  const passwordCheckResult = await meetingDao.selectmeetingPassword(
      connection,
      selectmeetingPasswordParams
  );
  connection.release();
  // return passwordCheckResult[0];
  return passwordCheckResult;
};

exports.accountCheck = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const meetingAccountResult = await meetingDao.selectmeetingAccount(connection, id);
  connection.release();

  return meetingAccountResult;
};