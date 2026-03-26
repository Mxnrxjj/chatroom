const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.31.241:5173"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ username, roomName }) => {
    socket.join(roomName);
    console.log(username + " joined room " + roomName);
  });

  socket.on("send-message", (data) => {
    socket.to(data.roomName).emit("receive-message", data);
  });

  socket.on("typing", ({ username, roomName }) => {
    socket.to(roomName).emit("typing", { username });
  });

  socket.on("stop-typing", ({ username, roomName }) => {
    socket.to(roomName).emit("stop-typing", { username });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

server.listen(3000, "192.168.31.241", () => {
  console.log("Server running on port 3000");
});