const express = require("./config/express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);

app.use(cors());
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Server is Running");
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomName, userStream, done) => {
    if (typeof done === "function") done(userStream);
    socket.join(roomName);

    socket.to(roomName).emit("user-connected", userStream);

    socket.on("disconnect", () => {
      socket.to(roomName).emit("user-disconnected", userStream);
    });
  });
});

server.listen(PORT, () =>
  console.log(`✅ Listening on http://localhost:${PORT}`)
);
