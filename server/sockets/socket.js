const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { log } = require("console");

const presence = new Map();

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

    const broadcastPresence = () => {
        const data = Array.from(presence.entries()).map(([userId, info]) => ({
            userId,
            status: info.status,
            lastSeen: info.lastSeen,
        }));

        io.emit("presence", data);
    };

    io.on("connection", (socket) => {
        console.log("User connected: ", socket.user.username);

        const userId = socket.user._id.toString();

        presence.set(userId, {
            socketId: socket.id,
            status: "online",
            lastSeen: new Date(),
        });

        broadcastPresence();

        console.log("Presence Map:", presence);


        socket.join(userId); //Personal room for notifications

        // Join chat 
        socket.on("joinChat", (chatId) => {
            socket.join(chatId);
            console.log(`${socket.user.username} joined the chat : ${chatId}`);
        });

        socket.on("typing", ({ chatId, userId }) => {
            socket.to(chatId).emit("typing", {
                chatId,
                user: {
                    _id: socket.user._id,
                    username: socket.user.username,
                    avatar: socket.user.avatar,
                }
            });
        });

        socket.on("stopTyping", ({ chatId, userId }) => {
            socket.to(chatId).emit("stopTyping", {
                chatId,
                userId: socket.user._id,
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected: " + socket.id);

            const user = presence.get(userId);

            if (user) {
                presence.set(userId, {
                    ...user,
                    status: "offline",
                    lastSeen: new Date(),
                })
            }

            broadcastPresence();
        });
    });
}