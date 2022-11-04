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
 * API Name : 본인이 속한 회의 검색어로 검색 API
 * [GET] /meetings/myMeeting/?search=
 * header : x-access-token
 * query string : search
 */
exports.getMeetingById = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;
    const search = req.query.search;

    // errResponse 전달
    if (!search) return res.send(errResponse(baseResponse.MEETING_SEARCH_EMPTY));

    const meetingSearchResponse = await meetingProvider.retrieveMeetingSearch(userIdxFromJWT, search);
    return res.send(meetingSearchResponse);
};

/**
 * API No. 3
 * API Name : meeting_id로 회의 검색 API
 * [GET] /meetings/search/:meetingId'
 * header : x-access-token
 * path variable : meetingId
 */
exports.getSortedMeetingById = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;
    const meeting_id = req.params.meetingId;

    // errResponse 전달
    if (!meeting_id) return res.send(errResponse(baseResponse.MEETING_ID_EMPTY));

    // 내 회의면 isMyMeeting : 1 else 0
    const meetingSearchResponse = await meetingProvider.retrieveSortedMeetingSearch(userIdxFromJWT, meeting_id);
    return res.send(meetingSearchResponse);
};

/**
 * API No. 4
 * API Name : 회의를 내 회의 리스트에 추가하기 API
 * [POST] '/meetings/myMeeting/:meetingId'
 * header : x-access-token
 * path variable : meetingId
 */
exports.postNewMeetingMatch = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;
    const meeting_id = req.params.meetingId;

    if (!meeting_id) return res.send(errResponse(baseResponse.MEETING_ID_EMPTY));

    const matchUserMeetingInfo = await meetingService.matchUserMeeting(userIdxFromJWT, meeting_id);
    return res.send(matchUserMeetingInfo);
};

/**
 * API No. 5
 * API Name : 새 회의 개설 API
 * [POST] '/meetings/newMeeting'
 * header : x-access-token
 * body : meeting_name
 */
exports.postNewMeeting = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const meeting_name = req.body.meeting_name;

    if (!meeting_name) return res.send(errResponse(baseResponse.MEETING_NAME_EMPTY));

    const addMeetingInfo = await meetingService.addNewMeeting(userIdxFromJWT, meeting_name);
    return res.send(addMeetingInfo);
};

/**
 * API No. 6
 * API Name : 회의를 내 회의 리스트에서 제거하기 API
 * [DELETE] '/meetings/myMeeting/:meetingId'
 * header : x-access-token
 * path variable : meetingId
 */
exports.deleteMyMeeting = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const meeting_id = req.params.meetingId;

    if (!meeting_id) return res.send(errResponse(baseResponse.MEETING_ID_EMPTY));

    const deleteMyMeetingInfo = await meetingService.unMatchUserMeeting(userIdxFromJWT, meeting_id);
    return res.send(deleteMyMeetingInfo);
};

/**
 * API No. 7
 * API Name : 기존 회의 다시 개설 API
 * [POST] '/meetings/openMeeting/:meetingId'
 * header : x-access-token
 * path variable : meetingId
 */
exports.postEnterMeeting = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const meeting_id = req.params.meetingId;

    if (!meeting_id) return res.send(errResponse(baseResponse.MEETING_ID_EMPTY));

    const enterMeetingInfo = await meetingService.enterMeeting(userIdxFromJWT, meeting_id);
    return res.send(enterMeetingInfo);
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

