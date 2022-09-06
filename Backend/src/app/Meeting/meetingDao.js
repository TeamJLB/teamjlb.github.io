
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 유저 생성 (회원가입)
async function insertmeetingInfo(connection, insertmeetingInfoParams) {
  const insertmeetingInfoQuery = `
        INSERT INTO meeting(meeting_name, id, password, email, phone)
        VALUES (?, ?, ?, ?, ?);
    `;
  const insertmeetingInfoRow = await connection.query(
    insertmeetingInfoQuery,
    insertmeetingInfoParams
  );

  return insertmeetingInfoRow;
}

// 아이디로 회원 조회
async function selectmeetingId(connection, id) {
  const selectmeetingIdQuery = `
                SELECT * 
                FROM meeting 
                WHERE id = ?;
                `;
  const [idRows] = await connection.query(selectmeetingIdQuery, id);
  return idRows;
}

// 패스워드 체크
async function selectmeetingPassword(connection, selectmeetingPasswordParams) {
  const selectmeetingPasswordQuery = `
        SELECT *
        FROM meeting
        WHERE id = ? AND password = ?;`;
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
  insertmeetingInfo,
  selectmeetingId,
  selectmeetingPassword,
  selectmeetingEmail,
  selectmeeting,
  selectmeetingAccount,
  updatemeetingInfo,
};
