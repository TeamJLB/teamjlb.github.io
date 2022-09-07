
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 유저 생성 (회원가입)
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(user_name, id, password, email, phone)
        VALUES (?, ?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 아이디로 회원 조회
async function selectUserId(connection, id) {
  const selectUserIdQuery = `
                SELECT * 
                FROM User 
                WHERE id = ?;
                `;
  const [idRows] = await connection.query(selectUserIdQuery, id);
  return idRows;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT *
        FROM User
        WHERE id = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow[0];
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email
                FROM User 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, id) {
  const selectUserAccountQuery = `
        SELECT status, user_id
        FROM User
        WHERE id = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      id
  );
  return selectUserAccountRow[0];
}

// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT * 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}


module.exports = {
  insertUserInfo,
  selectUserId,
  selectUserPassword,
  selectUserEmail,
  selectUser,
  selectUserAccount,
  updateUserInfo,
};
