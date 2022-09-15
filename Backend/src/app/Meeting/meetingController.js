const jwtMiddleware = require("../../../config/jwtMiddleware");
const meetingProvider = require("../../app/Meeting/meetingProvider");
const meetingService = require("../../app/Meeting/meetingService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 전체 회의 리스트 API
 * [GET] /meetings/allList
 * header : x-access-token
 */
exports.getAllMeetings = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;
    // 로그인 아이디 확인
    // console.log(userIdxFromJWT);
    // return res.send(response(baseResponse.SUCCESS, {'verified_user_id' : userIdxFromJWT}));

    const meetingListResponse = await meetingProvider.retrieveAllMeeting(userIdxFromJWT);

    return res.send(meetingListResponse);
};

/**
 * API No. 2
 * API Name : 본인이 속한 회의 검색 API
 * [GET] /meetings/myMeeting/?meetingId=
 * header : x-access-token
 * query string : meetingId
 */
exports.getMeetingById = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;
    const meeting_id = req.query.meetingId;

    // errResponse 전달
    if (!meeting_id) return res.send(errResponse(baseResponse.MEETING_ID_EMPTY));

    // meetingId를 통한 유저 검색 함수 호출 및 결과 저장
    const meetingIdResponse = await meetingProvider.retrieveMeeting(userIdxFromJWT, meeting_id);
    return res.send(meetingIdResponse);
};

/**
 * API No. 3
 * API Name : 새 회의 개설 API
 * [POST] '/meetings/newMeeting'
 * header : x-access-token
 * body : meeting_name, (first) topic
 */
exports.postNewMeeting = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const meeting_name = req.body.meeting_name;
    const first_topic = req.body.topic;

    if (!meeting_name) return res.send(errResponse(baseResponse.MEETING_NAME_EMPTY));
    if (!first_topic) return res.send(errResponse(baseResponse.MEETING_TOPIC_EMPTY));

    const addMeetingInfo = await meetingService.addNewMeeting(userIdxFromJWT, meeting_name, first_topic);
    return res.send(addMeetingInfo);
};

/**
 * API No. 4
 * API Name : 기존 회의 다시 개설 API
 * [POST] '/meetings/openMeeting/:meetingId'
 * header : x-access-token
 * path variable : meetingId
 * body : topic
 */
exports.postNewSubMeeting = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const meeting_id = req.params.meetingId;

    const new_topic = req.body.topic;

    if (!meeting_id) return res.send(errResponse(baseResponse.MEETING_ID_EMPTY));
    if (!new_topic) return res.send(errResponse(baseResponse.MEETING_TOPIC_EMPTY));

    const addSubMeetingInfo = await meetingService.addNewSubMeeting(userIdxFromJWT, meeting_id, new_topic);
    return res.send(addSubMeetingInfo);
};

/**
 * API No. 5
 * API Name : 새 회의 참가 API
 * [POST] '/meetings/newMeeting/:meetingId'
 * header : x-access-token
 * path variable : meetingId
 */
exports.joinNewMeeting = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const meeting_id = req.params.meetingId;

    const joinNewMeetingInfo = await meetingService.joinNewMeeting(userIdxFromJWT, meeting_id);
    return res.send(joinNewMeetingInfo);
};

/**
 * API No. 6
 * API Name : 회의 삭제 API
 * [DELETE] '/meetings/myMeeting/:meetingId'
 * header : x-access-token
 * path variable : meetingId
 */
exports.deleteMeeting = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const meeting_id = req.params.meetingId;

    if (!meeting_id) return res.send(errResponse(baseResponse.MEETING_ID_EMPTY));

    const deleteMeetingInfo = await meetingService.deleteMeeting(userIdxFromJWT, meeting_id);
    return res.send(deleteMeetingInfo);
};

/**
 * API No. 7
 * API Name : 회의 히스토리 리스트 API
 * [GET] /meetings/meetingHistory
 * header : x-access-token
 * query string : meetingId
 */
exports.getSubMeetingHistoryById = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const meeting_id = req.query.meetingId;

    if (!meeting_id) return res.send(errResponse(baseResponse.MEETING_ID_EMPTY));

    const subMeetingHistoryResponse = await meetingProvider.retrieveAllSubMeetingHistory(userIdxFromJWT, meeting_id);
    return res.send(subMeetingHistoryResponse);
};

