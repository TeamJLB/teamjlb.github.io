// 회원 id로 전체 회의 리스트 조회
async function selectSummaryById(connection, sub_meeting_id) {
  const selectSummaryByIdQuery = `
    SELECT S.match_id, U.user_name, S.summary_content, S.original_content
    FROM Summary S INNER JOIN Matching MC on S.match_id = MC.match_id INNER JOIN User U on MC.user_id = U.user_id
    WHERE MC.sub_meeting_id = ?;
  `;
  const summaryRow = await connection.query(selectSummaryByIdQuery, sub_meeting_id);
  return summaryRow[0];
}

// 요약 추가
async function insertSummaryInfo(connection, insertSummaryParams) {
  const insertSummaryInfoQuery = `
    INSERT INTO Summary (match_id, summary_content, original_content)
    VALUES
      (?, ?, ?)
  `;
  const insertSummaryInfoRow = await connection.query(insertSummaryInfoQuery, insertSummaryParams);

  return insertSummaryInfoRow;
}

// 요약 수정
async function updateSummaryInfo(connection, updateSummaryParams) {
  const updateSummaryInfoQuery = `
    UPDATE Summary
    SET summary_content = ?
    WHERE match_id = ?;
  `;
  const updateSummaryInfoRow = await connection.query(updateSummaryInfoQuery, updateSummaryParams);

  return updateSummaryInfoRow;
}

// 매칭 id로 매칭 존재 여부 체크
async function findMatchingById(connection, match_id) {
  const selectMatchingIdQuery = `
    SELECT *
    FROM Matching
    WHERE match_id = ?
  `;
  const matchingRow = await connection.query(selectMatchingIdQuery, match_id);
  return matchingRow[0];
}

module.exports = {
  selectSummaryById,
  insertSummaryInfo,
  updateSummaryInfo,
  findMatchingById,

};
