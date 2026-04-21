require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.31.239:5173"],
    methods: ["GET", "POST"],
  },
});

require("./sockets/socket")(io);


// Start the server after successful database connection
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
