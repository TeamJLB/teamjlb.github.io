// import express from "express";
// import http from "http";
// import cors from "cors";
// import { Server } from "socket.io";
// import roomModules from "./controllers/meetingRoomModules";
const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Server is Running");
});

const handleListen = () =>
  console.log(`✅ Listening on http://localhost:${PORT}`);

io.on("connection", (socket) => {
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to("welcome");
  });
});

server.listen(PORT, handleListen);
