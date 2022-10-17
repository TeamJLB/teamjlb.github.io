import roomModule from "./modules/meetingRoomModules";
const express = require("./config/express");
const { logger } = require("./config/winston");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;
// express().listen(port);
io.on("connection", roomModule.io);

server.listen(PORT, () =>
  console.log(`✅ Listening on http://localhost:${PORT}`)
);

// logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
