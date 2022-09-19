module.exports = function(app){
    const summary = require('./summaryController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 요약 내용 조회 API
    app.get('/summaries/summary', jwtMiddleware, summary.getSummaryById);

    // 2. 요약 추가 API
    app.post('/summaries/summary', jwtMiddleware, summary.postSummary);

    // 3. 요약 수정 API
    app.patch('/summaries/summary', jwtMiddleware, summary.patchSummary);

};