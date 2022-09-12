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


// 패스워드 체크
async function selectmeetingPassword(connection, selectmeetingPasswordParams) {
  const selectmeetingPasswordQuery = `
        SELECT *
        FROM meeting
        WHERE id = ? AND password = ?;
  `;
  const selectmeetingPasswordRow = await connection.query(
      selectmeetingPasswordQuery,
      selectmeetingPasswordParams
  );

  return selectmeetingPasswordRow[0];
}

// 이메일로 회원 조회
async function selectmeetingEmail(connection, email) {
  const selectmeetingEmailQuery = `
                SELECT email
                FROM meeting 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectmeetingEmailQuery, email);
  return emailRows;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectmeetingAccount(connection, id) {
  const selectmeetingAccountQuery = `
        SELECT status, meeting_id
        FROM meeting
        WHERE id = ?;`;
  const selectmeetingAccountRow = await connection.query(
      selectmeetingAccountQuery,
      id
  );
  return selectmeetingAccountRow[0];
}

// 모든 유저 조회
async function selectmeeting(connection) {
  const selectmeetingListQuery = `
                SELECT * 
                FROM meeting;
                `;
  const [meetingRows] = await connection.query(selectmeetingListQuery);
  return meetingRows;
}

async function updatemeetingInfo(connection, id, nickname) {
  const updatemeetingQuery = `
  UPDATE meetingInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updatemeetingRow = await connection.query(updatemeetingQuery, [nickname, id]);
  return updatemeetingRow[0];
}


module.exports = {
  selectAllMeetingByUserId,
  selectMeetingById,
  insertMeetingInfo,
  insertSubMeetingInfo,
  makeMatching,
  findMeetingId,
  selectSubMeetingById,

  selectmeetingPassword,
  selectmeetingEmail,
  selectmeeting,
  selectmeetingAccount,
  updatemeetingInfo,
};
