const express = require("./config/express");
const app = express();
const server = require("http").createServer(app);

const server_config = require("./config/server");
const PORT = server_config.web_port || process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is Running");
});

// Socket.io
require('./controllers/socket.js')(server);

server.listen(PORT, () =>
  console.log(`✅ Listening on http://${server_config.web_host}:${PORT}`)
);
