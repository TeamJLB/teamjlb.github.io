const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveAllUser = async function () {
  // connection 은 db와의 연결을 도와줌
  const connection = await pool.getConnection(async (conn) => conn);
  // Dao 쿼리문의 결과를 호출
  const userListResult = await userDao.selectUser(connection);
  // connection 해제
  connection.release();

  return userListResult;
};

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  if (userResult.length > 0)
    return response(baseResponse.SUCCESS, {'unique': false});
  else
    return response(baseResponse.SUCCESS, {'unique': true});

  // return userResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.retrieveUserList = async function (email) {

  //email을 인자로 받는 경우와 받지 않는 경우를 구분하여 하나의 함수에서 두 가지 기능을 처리함

  if (!email) {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    // Dao 쿼리문의 결과를 호출
    const userListResult = await userDao.selectUser(connection);
    // connection 해제
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.idCheck = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const idCheckResult = await userDao.selectUserId(connection, id);
  connection.release();

  return idCheckResult;
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  // 쿼리문에 여러개의 인자를 전달할 때 selectUserPasswordParams와 같이 사용합니다.
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  // return passwordCheckResult[0];
  return passwordCheckResult;
};

exports.accountCheck = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, id);
  connection.release();

  return userAccountResult;
};