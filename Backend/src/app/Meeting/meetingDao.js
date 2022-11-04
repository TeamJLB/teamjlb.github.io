// user_id로 전체 회의 리스트 조회
async function selectAllMeetingByUserId(connection, user_id) {
  const selectAllMeetingByIdQuery = `
    SELECT M.meeting_id, M.meeting_name, M.createdAt
    FROM UserMeetingMatch UMM INNER JOIN Meeting M on UMM.meeting_id = M.meeting_id
    WHERE UMM.user_id = ?;
  `;
  const [meetingRows] = await connection.query(selectAllMeetingByIdQuery, user_id);
  return meetingRows;
}

// user_id의 사용자가 포함되어 있는 회의를 meeting_id로 검색
async function selectMyMeetingById(connection, selectMeetingParams) {
  const searchMeetingByIdQuery = `
    SELECT M.meeting_id, M.meeting_name, M.createdAt
    FROM UserMeetingMatch UMM INNER JOIN Meeting M on UMM.meeting_id = M.meeting_id
    WHERE UMM.user_id = ? AND M.meeting_id = ?;
  `;
  const meetingRow = await connection.query(searchMeetingByIdQuery, selectMeetingParams);
  return meetingRow[0];
}

// meeting_id로 회의 검색 - 내 회의면 'isMyMeeting' = 1 else 0
async function selectSortedMeetingById(connection, selectMeetingParams) {
  const searchSortedMeetingByIdQuery = `
    SELECT M.meeting_id, M.meeting_name, M.createdAt,
           (SELECT EXISTS(SELECT * FROM UserMeetingMatch UMM WHERE UMM.user_id = ? and UMM.meeting_id = ?)) AS isMyMeeting
    FROM Meeting M
    WHERE M.meeting_id = ?;
  `;
  const meetingRow = await connection.query(searchSortedMeetingByIdQuery, selectMeetingParams);
  return meetingRow[0];
}

// user_id의 사용자가 포함되어 있는 회의를 검색어로 검색
async function selectMeetingSearch(connection, selectMeetingParams) {
  const searchMeetingSearchQuery = `
    SELECT M.meeting_id, M.meeting_name, M.createdAt
    FROM UserMeetingMatch UMM INNER JOIN Meeting M on UMM.meeting_id = M.meeting_id
    WHERE UMM.user_id = ? AND M.meeting_name like ?;
  `;
  const meetingRow = await connection.query(searchMeetingSearchQuery, selectMeetingParams);
  return meetingRow[0];
}

// meeting_id 로 회의가 존재하는지 체크
async function selectMeetingById(connection, meeting_id) {
  const searchMeetingByIdQuery = `
    SELECT meeting_id, meeting_name, createdAt
    FROM Meeting
    WHERE meeting_id = ?;
  `;
  const meetingRow = await connection.query(searchMeetingByIdQuery, meeting_id);
  return meetingRow[0];
}

// 이미 매칭된 유저-회의 매칭 정보가 있는지 체크
async function checkUMMatch(connection, selectUMMParams) {
  const selectUMMQuery = `
    SELECT *
    FROM UserMeetingMatch
    WHERE user_id = ? AND meeting_id = ?;
  `;
  const [matchRows] = await connection.query(selectUMMQuery, selectUMMParams);
  return matchRows;
}

// 회의를 내 회의 리스트에 추가하기
async function insertUserMeetingMatchInfo(connection, insertUMMParams) {
  const insertUserMeetingMatchInfoQuery = `
        INSERT INTO UserMeetingMatch (user_id, meeting_id)
        VALUE (?, ?);
  `;
  const insertUserMeetingMatchInfoRow = await connection.query(insertUserMeetingMatchInfoQuery, insertUMMParams);

  return insertUserMeetingMatchInfoRow;
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

// 회의를 내 회의 리스트에서 제거하기
async function deleteUserMeetingMatchInfo(connection, deleteUMMParams) {
  const deleteUserMeetingMatchInfoQuery = `
        DELETE FROM UserMeetingMatch
        WHERE user_id = ? AND meeting_id = ?;
  `;
  const deleteUserMeetingMatchInfoRow = await connection.query(deleteUserMeetingMatchInfoQuery, deleteUMMParams);

  return deleteUserMeetingMatchInfoRow;
}

// 회의에 남아있는 사람이 없는지 확인 - TODO 추후 남아있는 사람이 없으면 해당 Meeting을 삭제하기 위해
async function checkUMMById(connection, meeting_id) {
  const selectUMMByIdQuery = `
        SELECT *
        FROM UserMeetingMatch
        WHERE meeting_id = ?;
  `;
  const selectUMMByIdRow = await connection.query(selectUMMByIdQuery, meeting_id);

  return selectUMMByIdRow;
}


// 열려있는 서브회의가 있는지 확인하기 - 있으면 sub_meeting 반환, 없으면 null
async function selectOpenSubMeetingById(connection, meeting_id) {
  const selectOpenSubMeetingByIdQuery = `
        SELECT max(SM.sub_meeting_id) AS latest_sub_meeting_id
        FROM Meeting MT INNER JOIN SubMeeting SM on MT.meeting_id = SM.meeting_id
        WHERE MT.meeting_id = ? and SM.status = 'open';
  `;
  const meetingRow = await connection.query(selectOpenSubMeetingByIdQuery, meeting_id);
  return meetingRow[0];
}

// 열려있는 서브회의에 참여한 적이 있는지/없는지 확인하기 - 있으면 match_id 반환, 없으면 null
async function checkOnceEntered(connection, selectReenterSubMeetingParams) {
  const selectReenterSubMeetingQuery = `
        SELECT MC.match_id AS previous_match_id, MC.status
        FROM Matching MC
        WHERE MC.user_id = ? and MC.sub_meeting_id = ?;
  `;
  const subMeetingRow = await connection.query(selectReenterSubMeetingQuery, selectReenterSubMeetingParams);
  return subMeetingRow[0];
}

// 서브회의 입장하기1 - 서브회의 추가하기 (방을 새로 입장하는 경우)
async function insertSubMeetingInfo(connection, meeting_id) {
  const insertSubMeetingInfoQuery = `
        INSERT INTO SubMeeting (meeting_id)
        VALUE (?);
  `;
  const insertSubMeetingInfoRow = await connection.query(insertSubMeetingInfoQuery, meeting_id);

  return insertSubMeetingInfoRow;
}

// 서브회의 입장하기2 - 서브회의와 회원 매칭하기 (서브회의 개설한 경우, 열려있는 서브회의에 새로 참여하는 경우)
async function makeMatching(connection, insertMatchingParams) {
  const insertMatchingInfoQuery = `
        INSERT INTO Matching (user_id, sub_meeting_id)
        VALUE (?, ?);
  `;
  const insertMatchingInfoRow = await connection.query(insertMatchingInfoQuery, insertMatchingParams);

  return insertMatchingInfoRow;
}

// 서브회의 입장하기3 - 매칭 상태 활성화하기 (열려있는 회의에 참여한 적이 있다가 다시 참여하는 경우)
async function updateMatchingToActiveById(connection, match_id) {
  const updateMatchingToActiveByidQuery = `
        UPDATE Matching
        SET status='active'
        WHERE match_id = ?;
  `;
  const updateMatchingToActiveByIdRow = await connection.query(updateMatchingToActiveByidQuery, match_id);

  return updateMatchingToActiveByIdRow;
}

// TODO 서브회의 퇴장하기부터


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

// (deprecated)회원 id와 회의 id 를 포함한 매칭 id 삭제
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
  selectMyMeetingById,
  selectSortedMeetingById,
  selectMeetingSearch,
  selectMeetingById,
  checkUMMatch,
  insertUserMeetingMatchInfo,
  insertMeetingInfo,
  deleteUserMeetingMatchInfo,
  checkUMMById,
  selectOpenSubMeetingById,
  checkOnceEntered,
  insertSubMeetingInfo,
  makeMatching,
  updateMatchingToActiveById,

  findMeetingId,
  selectSubMeetingById,
  findAllMatchingId,
  deleteAllMatchingIds,
  selectAllSubMeetingHistory,
  selectAllParticipantBySubMeetingId,
  selectAllKeywordBySubMeetingId,

};
