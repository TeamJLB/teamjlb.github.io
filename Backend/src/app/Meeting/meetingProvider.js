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
  const meetingResult = await meetingDao.selectMeetingById(connection, [userIdx, meetingId]);

  connection.release();

  if (meetingResult.length > 0)
    return response(baseResponse.SUCCESS, meetingResult);
  else
    return errResponse(baseResponse.MEETING_ID_NOT_EXISTS);

  // return meetingResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.meetingCheckById = async function (meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const idCheckResult = await meetingDao.findMeetingId(connection, meeting_id);
  connection.release();

  return idCheckResult;
};

exports.matchingCheck = async function (userIdx, meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const matchCheckResult = await meetingDao.findAllMatchingId(connection, [userIdx, meeting_id]);
  connection.release();

  return matchCheckResult;
};

exports.retrieveAllSubMeetingHistory = async function (userIdx, meeting_id) {
  const connection = await pool.getConnection(async (conn) => conn);

  // 서브 회의 리스트 가져오기
  const allSubMeetingHistoryResult = await meetingDao.selectAllSubMeetingHistory(connection, meeting_id);
  console.log(allSubMeetingHistoryResult);

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
