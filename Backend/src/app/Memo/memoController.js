const jwtMiddleware = require("../../../config/jwtMiddleware");
const memoProvider = require("../../app/Memo/memoProvider");
const memoService = require("../../app/Memo/memoService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 새 메모 추가 API
 * [POST] '/memos/memo'
 * header : x-access-token
 * body : subMeeting_id, content
 */
exports.postNewMemo = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const sub_meeting_id = req.body.subMeeting_id;
    const memo_content = req.body.content;

    if (!sub_meeting_id) return res.send(errResponse(baseResponse.SUBMEETING_ID_EMPTY));

    const addMemoInfo = await memoService.addNewMemo(userIdxFromJWT, sub_meeting_id, memo_content);
    return res.send(addMemoInfo);
};

/**
 * API No. 2
 * API Name : 메모 조회 API
 * [GET] /memos/memo/:subMeetingId
 * header : x-access-token
 * path variable : subMeetingId
 */
exports.getMemoById = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;
    const sub_meeting_id = req.params.subMeetingId;

    if (!sub_meeting_id) return res.send(errResponse(baseResponse.SUBMEETING_ID_EMPTY));

    const getMemoResponse = await memoProvider.retrieveMemo(userIdxFromJWT, sub_meeting_id);
    return res.send(getMemoResponse);
};

/**
 * API No. 3
 * API Name : 메모 수정 API
 * [PATCH] /memos/memo/?subMeetingId=
 * header : x-access-token
 * path variable : subMeetingId
 * body : content
 */
exports.patchMemo = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;
    const sub_meeting_id = req.params.subMeetingId;
    const changed_content = req.body.content;

    if (!sub_meeting_id) return res.send(errResponse(baseResponse.SUBMEETING_ID_EMPTY));

    // meetingId를 통한 유저 검색 함수 호출 및 결과 저장
    const patchMemoResponse = await memoService.changeMemo(userIdxFromJWT, sub_meeting_id, changed_content);
    return res.send(patchMemoResponse);
};

/**
 * API No. 4
 * API Name : 한 회의에 대한 모든 메모리스트 조회 API
 * [GET] /memos/memoList/:meetingId
 * header : x-access-token
 * path variable : meetingId
 */
exports.getAllMemos = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;
    const meeting_id = req.params.meetingId;

    if (!meeting_id) return res.send(errResponse(baseResponse.MEETING_ID_EMPTY));

    const memoListResponse = await memoProvider.retrieveAllMemoById(userIdxFromJWT, meeting_id);

    return res.send(memoListResponse);
};


/**
 * API No. 5
 * API Name : 키워드 추가 API
 * [POST] '/memos/keywords'
 * header : x-access-token
 * body : memo_id, keywords
 */
exports.postKeywords = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const memo_id = req.body.memo_id;
    const keywords = req.body.keywords;

    if (!memo_id) return res.send(errResponse(baseResponse.MEMO_ID_EMPTY));

    const addKeywordInfo = await memoService.addKeywords(userIdxFromJWT, memo_id, keywords);
    return res.send(addKeywordInfo);
};
