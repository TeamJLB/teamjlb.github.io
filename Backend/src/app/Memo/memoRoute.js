module.exports = function(app){
    const memo = require('./memoController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 새 메모 추가 API
    app.post('/memos/memo', jwtMiddleware, memo.postNewMemo);

    // 2. 메모 조회 API
    app.get('/memos/memo/:subMeetingId', jwtMiddleware, memo.getMemoById);

    // 3. 메모 수정 API
    app.patch('/memos/memo/:subMeetingId', jwtMiddleware, memo.patchMemo);

    // 4. 한 회의에 대한 모든 메모리스트 조회 API
    app.get('/memos/memoList/:meetingId', jwtMiddleware, memo.getAllMemos);


    // TODO 메모 추가 시, 바로 키워드를 뽑아서 keyword db에 넣기?
    // 5. 키워드 추가 API
    app.post('/memos/keywords', jwtMiddleware, memo.postKeywords);
};