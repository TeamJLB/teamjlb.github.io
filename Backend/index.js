// import roomModule from "./modules/meetingRoomModules";
const express = require("./config/express");
// const { logger } = require("./config/winston");

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

// express().listen(port);
io.on("connection", (socket) => {
  socket.on("join-room", (roomName, userId, done) => {
    if (typeof done === "function") done(userId);
    socket.join(roomName);
    done(userId);

    socket.to(roomName).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomName).emit("user-disconnected", userId, streamId);
    });
  });
});

server.listen(PORT, () =>
  console.log(`✅ Listening on http://localhost:${PORT}`)
);

// logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
