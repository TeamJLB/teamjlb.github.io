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
        
        // const new_process = spawn('bash');
        // const summarize_process = spawn("../Text Summarization/KoreanReviewSummarizer/ks4r/testenv/bin/python", ["../Text Summarization/KoreanReviewSummarizer/ks4r/__init__.py", text]);
        // const summarize_process = spawn('source', ["../Text Summarization/KoreanReviewSummarizer/ks4r/testenv/bin/activate"]);
        // 실행할 커맨드 생성
        // const command = 'python /Users/jaehobyun/JB/_Coding/school/graduation project/2022-graduation-project/Text Summarization/KoreanReviewSummarizer/ks4r/__init__.py \n';
        // const command = `python ../Text Summarization/KoreanReviewSummarizer/ks4r/__init__.py ${text} \n`
        // 부모 프로세스에서 자식 프로세스로 명령 보내기
        // new_process.stdin.write(command);
        // new_process.stdin.end();

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

        // const python = spawn('python', ["../../Text Summarization/KoreanReviewSummarizer/ks4r/__init__.py", text]);
        // python.stdout.on('data', (data) => {
        //   console.log(data.toString());
        //   socket.emit("result", data.toString());
        // });
      });

  // });    
  // io.on('connection', (socket) => {
  //     // test for front-back communication
  //     // console.log("Client: Connected to Socket.io");
  //     socket.emit("connection", "connection ready");
      
  //     socket.emit("test", "testing");
    

// ---------------------------------------------
    // // 룸 입장 대기 (참여자 조회)
    // socket.on('gate', (roomId) => {
    //   socket.join(roomId); // 소켓을 특정 room에  binding합니다.

    //   io.sockets.in(roomId).emit('gate', roomId, {
    //     participants: rooms[roomId] || null,
    //   });
    // });

    // // 룸접속
    // socket.on('enter', (roomId, userInfo) => {
    //   console.log('[서버] enter', roomId, userInfo);
    //   socket.join(roomId); // 소켓을 특정 room에 binding합니다.

    //   const userData = {
    //     ...userInfo,
    //     socketId: socket.id,
    //   };

    //   // 룸에 사용자 정보 추가
    //   if (!rooms[roomId]) {
    //     rooms[roomId] = {};
    //   }
    //   rooms[roomId][socket.id] = userData;
    //   let thisRoom = rooms[roomId];

    //   // 유저 정보 추가
    //   io.sockets.in(roomId).emit('join', roomId, {
    //     userInfo: userData,
    //     participants: thisRoom,
    //   });
    // });

    // /**
    //  * 메시지 핸들링
    //  */
    // socket.on('message', (data) => {
    //   console.log('[서버] message', data);

    //   if (data.to === 'all') {
    //     // for broadcasting without me
    //     socket.broadcast.to(data.roomId).emit('message', data);
    //   } else {
    //     // for target user
    //     const targetSocketId = data.to;
    //     if (targetSocketId) {
    //       io.to(targetSocketId).emit('message', data);
    //     }
    //   }
    // });

    // /**
    //  * 연결 해제 핸들링
    //  */
    // socket.on('disconnect', () => {
    //   console.log('[서버] a user disconnected', socket.id);
    //   const roomId = findRoomBySocketId(socket.id);

    //   if (roomId) {
    //     const userInfo = rooms[roomId][socket.id];
    //     delete rooms[roomId][socket.id]; // 해당 유저 제거

    //     // 해당룸에 유저 정보 전달
    //     socket.broadcast.to(roomId).emit('leave', {
    //       userInfo,
    //       participants: rooms[roomId],
    //     });
    //   }
    // });
  });
};
