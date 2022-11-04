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

  return response(baseResponse.SUCCESS, allMeetingListResult);
};

exports.retrieveMeeting = async function (userIdx, meetingId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const meetingResult = await meetingDao.selectMyMeetingById(connection, [userIdx, meetingId]);

  connection.release();

  if (meetingResult.length > 0)
    return response(baseResponse.SUCCESS, meetingResult);
  else
    return errResponse(baseResponse.MEETING_ID_NOT_EXISTS);

  // return meetingResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.retrieveMeetingSearch = async function (userIdx, search) {
  const connection = await pool.getConnection(async (conn) => conn);
  search = '%' + search + '%'   // 해당 검색어를 포함하는 모든 결과를 찾기 위해
  const meetingResult = await meetingDao.selectMeetingSearch(connection, [userIdx, search]);

  connection.release();

  if (meetingResult.length > 0)
    return response(baseResponse.SUCCESS, meetingResult);
  else
    return errResponse(baseResponse.MEETING_SEARCH_NOT_EXISTS);
};

exports.retrieveSortedMeetingSearch = async function (userIdx, meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const meetingResult = await meetingDao.selectSortedMeetingById(connection, [userIdx, meeting_id, meeting_id]);

  connection.release();

  if (meetingResult.length > 0)
    return response(baseResponse.SUCCESS, meetingResult);
  else
    return errResponse(baseResponse.MEETING_ID_NOT_EXISTS);
};

exports.checkMeetingById = async function (meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const idCheckResult = await meetingDao.selectMeetingById(connection, meeting_id);
  connection.release();

  return idCheckResult;
};

exports.checkUserMeetingMatch = async function (userIdx, meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const matchCheckResult = await meetingDao.checkUMMatch(connection, [userIdx, meeting_id]);
  connection.release();

  return matchCheckResult;
};

exports.checkOpenSubMeetingById = async function (meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const subMeetingOpenCheckResult = await meetingDao.selectOpenSubMeetingById(connection, meeting_id);
  connection.release();

  return subMeetingOpenCheckResult[0];
};

exports.checkPreviousMatchingById = async function (userIdx, sub_meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const previousMatchingCheckResult = await meetingDao.checkOnceEntered(connection, [userIdx, sub_meeting_id]);
  connection.release();

  return previousMatchingCheckResult;
};

exports.retrieveAllSubMeetingHistory = async function (userIdx, meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);

  // 서브 회의 리스트 가져오기
  const allSubMeetingHistoryResult = await meetingDao.selectAllSubMeetingHistory(connection, meeting_id);
  // console.log(allSubMeetingHistoryResult);

  let sub_meeting_id;
  for (const result of allSubMeetingHistoryResult) {
    sub_meeting_id = result.sub_meeting_id;
    // console.log(sub_meeting_id);

    // 각 서브회의 id 들로 참가자들 가져오기
    let participants = []
    const getAllParticipantResult = await meetingDao.selectAllParticipantBySubMeetingId(connection, sub_meeting_id);
    // console.log(`sub_id : ${sub_meeting_id}, participants : ${getAllParticipantResult}`);
    // console.log(getAllParticipantResult);
    getAllParticipantResult.forEach((participant) => {
      participants.push(participant.user_name);
    })
    // console.log(participants);

    // 각 서브회의 id 들로 키워드들 가져오기
    let keywords = []
    const getAllKeywordResult = await meetingDao.selectAllKeywordBySubMeetingId(connection, sub_meeting_id);
    // console.log(`sub_id : ${sub_meeting_id}, keywords : ${getAllKeywordResult}`);
    // console.log(getAllKeywordResult);
    getAllKeywordResult.forEach((keyword) => {
      keywords.push(keyword.keyword_content);
    })
    // console.log(keywords);

    result['participants'] = participants;
    result['keywords'] = keywords;
  }
  // console.log(allSubMeetingHistoryResult);

  connection.release();

  return response(baseResponse.SUCCESS, allSubMeetingHistoryResult);
};
