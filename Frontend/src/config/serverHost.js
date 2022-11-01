// ***API 통신*** 을 로컬 또는 원격에서 테스트하고 싶을 때, 이 파일에서 current_host 만 원하는 서버 ip로 바꿔주시면 됩니다!
// 포트 또한, 서버에서 설정한 포트로 변경해주려면 current_port 만 고치면 됩니다!
module.exports = {
    // 로컬에서 실행할 때 호스트 (임시)
    'current_host' : 'localhost',
    
    // 원격 서버에서 실행할 때 호스트
    // 'current_host' : '[여기에 서버 ip 주소를 입력해주세요]',

    // 연결할 때 쓰는 포트번호
    'current_port' : '3000',
};