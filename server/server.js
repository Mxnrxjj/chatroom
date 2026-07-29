require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];

const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

const server = http.createServer(app);
const PORT = process.env.PORT;

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

require("./sockets/socket")(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

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
