const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Chat = require("../models/Chat");

module.exports = (io) => {

    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            console.log("TOKEN:", socket.handshake.auth.token);

            if (!token) {
                return next(new Error("Not Authenticated"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("DECODED:", decoded);
            const user = await User.findById(decoded.id).select("-password");
            console.log("USER:", user);

            socket.user = user;

            next();
        } catch (error) {
            return next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected: ", socket.user.username);

        // Join room 
        socket.on("join-chat", (chatId) => {
            socket.join(chatId);
            console.log(`${socket.user.username} joined the chat`);
        });

        // Send message
        socket.on("send-message", async (data) => {
            try {
                const { content, chatId } = data;

                // Save message to database0
                const message = await Message.create({
                    sender: socket.user._id,
                    content,
                    chat: chatId,
                });

                // Update latest message in chat
                await Chat.findByIdAndUpdate(chatId, {
                    latestMessage: message._id,
                });

                // Broadcast message to room
                io.to(chatId).emit("receive-message", message);

            } catch (error) {
                console.error("Error sending message: ", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected: " + socket.id);
        });
    });
}