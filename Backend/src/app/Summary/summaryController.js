const jwtMiddleware = require("../../../config/jwtMiddleware");
const summaryProvider = require("../../app/Summary/summaryProvider");
const summaryService = require("../../app/Summary/summaryService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 요약 내용 조회 API
 * [GET] /summaries/summary/:subMeetingId
 * header : x-access-token
 * path variable : subMeetingId
 */
exports.getSummaryById = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;
    const sub_meeting_id = req.params.subMeetingId;

    if (!sub_meeting_id) return res.send(errResponse(baseResponse.SUBMEETING_ID_EMPTY));

    const summaryResponse = await summaryProvider.retrieveSummary(userIdxFromJWT, sub_meeting_id);

    return res.send(summaryResponse);
};

/**
 * API No. 2
 * API Name : 요약 추가 API
 * [POST] '/summaries/summary'
 * header : x-access-token
 * body : match_id, summary_content, original_content
 */
exports.postSummary = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const match_id = req.body.match_id;
    const summary_content = req.body.summary_content;
    const original_content = req.body.original_content;

    if (!match_id) return res.send(errResponse(baseResponse.MATCH_ID_EMPTY));

    const addSummaryInfo = await summaryService.addSummary(userIdxFromJWT, match_id, summary_content, original_content);
    return res.send(addSummaryInfo);
};

/**
 * API No. 3
 * API Name : 요약 수정 API
 * [PATCH] '/summaries/summary'
 * header : x-access-token
 * body : match_id, summary_content
 */
exports.patchSummary = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.user_id;

    const match_id = req.body.match_id;
    const summary_content = req.body.summary_content;

    if (!match_id) return res.send(errResponse(baseResponse.MATCH_ID_EMPTY));

    const changeSummaryInfo = await summaryService.changeSummary(userIdxFromJWT, match_id, summary_content);
    return res.send(changeSummaryInfo);
};
