// 새 메모 추가
async function insertMemoInfo(connection, insertMemoParams) {
    const insertMemoInfoQuery = `
        INSERT INTO Memo (sub_meeting_id, memo_content)
        VALUE (?, ?);
  `;
    const insertMemoInfoRow = await connection.query(insertMemoInfoQuery, insertMemoParams);

    return insertMemoInfoRow;
}

// 서브회의 id로 메모 검색
async function selectMemoById(connection, sub_meeting_id) {
    const searchMemoByIdQuery = `
        SELECT MM.memo_id, SM.sub_meeting_id, SM.createdAt, SM.topic, MM.memo_content
        FROM Memo MM INNER JOIN SubMeeting SM on MM.sub_meeting_id = SM.sub_meeting_id
        WHERE SM.sub_meeting_id = ?;
    `;
    const memoRow = await connection.query(searchMemoByIdQuery, sub_meeting_id);
    return memoRow[0];
}

// 메모 수정
async function updateMemoInfo(connection, updateMemoParams) {
    const updateMemoInfoQuery = `
        UPDATE Memo
        SET memo_content = ?
        WHERE sub_meeting_id = ?;
    `;
    const updateMemoInfoRow = await connection.query(updateMemoInfoQuery, updateMemoParams);

    return updateMemoInfoRow;
}

// 회의 id로 전체 메모 리스트 조회
async function selectAllMemoById(connection, meeting_id) {
    const selectAllMemoByIdQuery = `
        SELECT MM.memo_id, SM.sub_meeting_id, SM.createdAt, SM.topic, MM.memo_content
        FROM Memo MM INNER JOIN SubMeeting SM on MM.sub_meeting_id = SM.sub_meeting_id INNER JOIN Meeting MT on SM.meeting_id = MT.meeting_id
        WHERE MT.meeting_id = ?;
  `;
    const [memoRows] = await connection.query(selectAllMemoByIdQuery, meeting_id);
    return memoRows;
}


module.exports = {
    insertMemoInfo,
    selectMemoById,
    updateMemoInfo,
    selectAllMemoById,

};
