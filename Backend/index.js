const express = require("./config/express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);

const server_config = require("./config/server");
const PORT = server_config.web_port || process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is Running");
});

// Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
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
// require('./controllers/socket.js')(server);

server.listen(PORT, () =>
  console.log(`✅ Listening on http://${server_config.web_host}:${PORT}`)
);
