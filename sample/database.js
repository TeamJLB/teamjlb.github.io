// [파일 위치] Backend/config
const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: '[내 db 호스트]',
    port: '[내 db 포트번호]',
    user: '[내 user]',
    password: '[내 password]',
    database: '[내 database]'
});

module.exports = {
    pool: pool
};