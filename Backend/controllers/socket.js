const path = require('path');

/**
 * Websocket handler
 * @param server
 */
module.exports = (server) => {
    // const io = require('socket.io')(server);
  const {spawn} = require('child_process');   // python 파일을 읽어오기 위해
  const io = require("socket.io")(server, {
      cors: {
        origin: "*",
        credentials: true,
      },
    });
  
  // --- (오픈 소스 설계 방식) ---
  // let rooms = {};
  // /**
  //  * SocketId로 방을 탐색 합니다.
  //  * @param value
  //  * @returns {*}
  //  */
  // function findRoomBySocketId(value) {
  //   const arr = Object.keys(rooms);
  //   let result = null;

  //   for (let i = 0; i < arr.length; i++) {
  //     if (rooms[arr[i]][value]) {
  //       result = arr[i];
  //       break;
  //     }
  //   }

  //   return result;
  // }
  // -------------------------

  /**
   * 소켓 연결
   */
  io.on("connection", (socket) => {
      socket.on("join-room", (roomName, userStream, done) => {
        if (typeof done === "function") done(userStream);
        socket.join(roomName);
    
        socket.to(roomName).emit("user-connected", userStream);
    
        socket.on("disconnect", () => {
          socket.to(roomName).emit("user-disconnected", userStream);
        });
      });

      // [문서 요약]
      socket.on("stt_data", (text) => {
        console.log(text);

        // 요약 모델 디렉토리
        const summary_dir = path.join(__dirname, '../../Text Summarization/KoreanReviewSummarizer/ks4r');
        console.log(summary_dir);
        
        // spawn 으로 새 프로세스 생성
        const summarize_process = spawn("python", [summary_dir+"/__init__.py", text.trim()]);
        // [AWS 에서 할 땐 아래껄로 해야함]
        // const summarize_process = spawn("python3", [summary_dir+"/__init__.py", text.trim()]);
        
        try{
          // 반환 내용 출력
          summarize_process.stdout.on('data', (result) => {
            console.log(result.toString());
            // 요약 결과 보내기
            socket.emit("result", result.toString());
          });

          // 에러 시 출력
          summarize_process.stderr.on('data', (result)=>{
            console.log('error 발생 :', result.toString());
          })

          // 명령이 끝나면 close
          summarize_process.on('exit', (code)=>{
            console.log('exit code :', code);
          })
        } catch (err) {
          console.log('error');
        }
      });
  });
};
