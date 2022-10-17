exports.createRoom = async (req, res) => {
  // await
};

exports.io = (socket) => {
  socket.on("join-room", (roomName, done) => {
    socket.join(roomName);
    done();
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("call-ended");
  });
};
