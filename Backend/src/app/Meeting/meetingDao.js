// 회원 id로 전체 회의 리스트 조회
async function selectAllMeetingByUserId(connection, user_id) {
  const selectAllMeetingByIdQuery = `
    SELECT DISTINCT M.meeting_id, M.meeting_name, M.createdAt
    FROM Matching MC INNER JOIN SubMeeting SM on MC.sub_meeting_id = SM.sub_meeting_id INNER JOIN Meeting M on SM.meeting_id = M.meeting_id
    WHERE MC.user_id = ?;
  `;
  const [meetingRows] = await connection.query(selectAllMeetingByIdQuery, user_id);
  return meetingRows;
}

// 회원 id의 회의 id로 회의 검색
async function selectMeetingById(connection, selectMeetingParams) {
  const searchMeetingByIdQuery = `
    SELECT DISTINCT M.meeting_id, M.meeting_name, M.createdAt
    FROM Matching MC INNER JOIN SubMeeting SM on MC.sub_meeting_id = SM.sub_meeting_id INNER JOIN Meeting M on SM.meeting_id = M.meeting_id
    WHERE MC.user_id = ? AND M.meeting_id = ?;
  `;
  const meetingRow = await connection.query(searchMeetingByIdQuery, selectMeetingParams);
  return meetingRow[0];
}

// 새 회의 개설
async function insertMeetingInfo(connection, meeting_name) {
  const insertMeetingInfoQuery = `
        INSERT INTO Meeting (meeting_name)
        VALUE (?);
  `;
  const insertMeetingInfoRow = await connection.query(insertMeetingInfoQuery, meeting_name);

  return insertMeetingInfoRow;
}

// 새 회의의 첫번째 주제 추가
async function insertSubMeetingInfo(connection, insertSubMeetingInfoParams) {
  const insertSubMeetingInfoQuery = `
        INSERT INTO SubMeeting (meeting_id, topic)
        VALUE (?, ?);
  `;
  const insertSubMeetingInfoRow = await connection.query(insertSubMeetingInfoQuery, insertSubMeetingInfoParams);

  return insertSubMeetingInfoRow;
}

// 회의 주제와 회원 매칭하기
async function makeMatching(connection, insertMatchingParams) {
  const insertMatchingInfoQuery = `
        INSERT INTO Matching (user_id, sub_meeting_id)
        VALUE (?, ?);
  `;
  const insertMatchingInfoRow = await connection.query(insertMatchingInfoQuery, insertMatchingParams);

  return insertMatchingInfoRow;
}

// 회의 id로 회의 존재 여부 체크
async function findMeetingId(connection, meeting_id) {
  const selectMeetingIdQuery = `
                SELECT * 
                FROM Meeting 
                WHERE meeting_id = ?;
  `;
  const meetingRow = await connection.query(selectMeetingIdQuery, meeting_id);
  return meetingRow[0];
}

// 회의 id로 해당 서브회의 id 검색
async function selectSubMeetingById(connection, meeting_id) {
  const searchSubMeetingByIdQuery = `
    SELECT max(SM.sub_meeting_id) AS latest_sub_meeting_id
    FROM Meeting MT INNER JOIN SubMeeting SM on MT.meeting_id = SM.meeting_id
    WHERE MT.meeting_id = ?;
  `;
  const subMeetingRow = await connection.query(searchSubMeetingByIdQuery, meeting_id);
  return subMeetingRow[0];
}

// 회원과 회의 사이의 매칭 id 체크
async function findAllMatchingId(connection, selectMatchingParams) {
  const selectMatchingIdQuery = `
    SELECT MC.match_id
    FROM SubMeeting SM INNER JOIN Meeting MT on SM.meeting_id = MT.meeting_id INNER JOIN Matching MC on SM.sub_meeting_id = MC.sub_meeting_id
    WHERE MC.user_id = ? AND MT.meeting_id = ?;
  `;
  const [matchingRows] = await connection.query(selectMatchingIdQuery, selectMatchingParams);
  return matchingRows;
}

// 회원 id와 회의 id 를 포함한 매칭 id 삭제
async function deleteAllMatchingIds(connection, deleteMatchingParams) {
  const deleteAllMatchingIdQuery = `
    DELETE FROM Matching
    WHERE match_id IN (
      SELECT match_id
      FROM (
             SELECT MC.match_id
             FROM SubMeeting SM INNER JOIN Meeting MT on SM.meeting_id = MT.meeting_id INNER JOIN Matching MC on SM.sub_meeting_id = MC.sub_meeting_id
             WHERE MC.user_id = ? AND MT.meeting_id = ?
           ) AS TMP
    );
  `;
  const deleteMatchingInfoRow = await connection.query(deleteAllMatchingIdQuery, deleteMatchingParams);
  return deleteMatchingInfoRow;
}

// 회의 id로 서브 회의 히스토리 조회
async function selectAllSubMeetingHistory(connection, meeting_id) {
  const selectAllSubMeetingHistoryQuery = `
    SELECT DISTINCT MC.sub_meeting_id, SM.createdAt, SM.topic
    FROM Matching MC INNER JOIN SubMeeting SM on MC.sub_meeting_id = SM.sub_meeting_id INNER JOIN Meeting M on SM.meeting_id = M.meeting_id
    WHERE M.meeting_id = ?;
  `;
  const [historyRows] = await connection.query(selectAllSubMeetingHistoryQuery, meeting_id);
  return historyRows;
}

// 서브회의 id로 참가자 조회
async function selectAllParticipantBySubMeetingId(connection, sub_meeting_id) {
  const selectAllParticipantBySubMeetingIdQuery = `
    SELECT U.user_name
    FROM User U INNER JOIN Matching MC on U.user_id = MC.user_id
    WHERE MC.sub_meeting_id = ?;
  `;
  const [participantRows] = await connection.query(selectAllParticipantBySubMeetingIdQuery, sub_meeting_id);
  return participantRows;
}

// 서브회의 id로 키워드 조회
async function selectAllKeywordBySubMeetingId(connection, sub_meeting_id) {
  const selectAllKeywordBySubMeetingIdQuery = `
    SELECT DISTINCT K.keyword_content
    FROM Keyword K INNER JOIN Memo MM on K.memo_id = MM.memo_id INNER JOIN Matching MC on MM.sub_meeting_id = MC.sub_meeting_id
    WHERE MM.sub_meeting_id = ?;
  `;
  const [keywordRows] = await connection.query(selectAllKeywordBySubMeetingIdQuery, sub_meeting_id);
  return keywordRows;
}

module.exports = {
  selectAllMeetingByUserId,
  selectMeetingById,
  insertMeetingInfo,
  insertSubMeetingInfo,
  makeMatching,
  findMeetingId,
  selectSubMeetingById,
  findAllMatchingId,
  deleteAllMatchingIds,
  selectAllSubMeetingHistory,
  selectAllParticipantBySubMeetingId,
  selectAllKeywordBySubMeetingId,

};
