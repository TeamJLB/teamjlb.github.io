//Response로 보내줄 상태코드와 메세지 등을 이 파일에서 관리함

module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMPTY : { "isSuccess": false, "code": 2001, "message":"빠진 내용을 입력해주세요" },

    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "아이디를 입력해주세요" },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    // ---
    MEETING_ID_EMPTY : { "isSuccess": false, "code": 2100, "message": "회의 ID를 입력해주세요" },
    MEETING_NAME_EMPTY : { "isSuccess": false, "code": 2101, "message": "회의 이름을 입력해주세요" },
    MEETING_TOPIC_EMPTY : { "isSuccess": false, "code": 2102, "message": "회의 주제를 입력해주세요" },
    MEETING_SEARCH_EMPTY : { "isSuccess": false, "code": 2103, "message": "검색어를 입력해 입력해주세요" },

    // ---
    SUBMEETING_ID_EMPTY : { "isSuccess": false, "code": 2200, "message": "서브회의 ID를 입력해주세요" },

    // ---
    MATCH_ID_EMPTY : { "isSuccess": false, "code": 2300, "message": "매칭 ID를 입력해주세요" },

    // ---
    MEMO_ID_EMPTY : { "isSuccess": false, "code": 2400, "message": "매모 ID를 입력해주세요" },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 아이디입니다." },

    SIGNIN_NICKNAME_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    MEETING_ID_NOT_EXISTS : { "isSuccess": false, "code": 3100, "message": "해당 ID의 회의가 존재하지 않습니다." },
    MEETING_REDUNDANT_NAME : { "isSuccess": false, "code": 3101, "message": "중복된 회의 이름입니다." },
    MEETING_NO_MATCHING : { "isSuccess": false, "code": 3102, "message": "삭제할 매칭 정보(회의)가 없습니다." },
    MEETING_SEARCH_NOT_EXISTS : { "isSuccess": false, "code": 3103, "message": "해당 검색어를 포함한 회의가 존재하지 않습니다." },

    MATCHING_NO_RESULT : { "isSuccess": false, "code": 3200, "message": "해당 match_id의 매칭 정보가 없습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
    TRANSACTION_ERROR : { "isSuccess": false, "code": 4002, "message": "트랜잭션 도중 에러"},
 
}
