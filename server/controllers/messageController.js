const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require("../models/User");
const ensureChatAccess = require("../utils/ensureChatAccess");
const ChatParticipant = require('../models/ChatParticipant');

const sendMessage = async (req, res) => {
    try {
        const { content, chatId, receiverId } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        if (!content.trim()) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        let chat;

        if (chatId) {
            chat = await ensureChatAccess(chatId, req.user._id);
        }
        else if (receiverId) {

            const receiver = await User.findById(receiverId);

            if (!receiver) {
                return res.status(404).json({
                    message: "Receiver not found",
                });
            }

            chat = await Chat.findOne({
                isGroupChat: false,
                chatKey: [req.user._id, receiverId].sort().join("_"),
            });

            if (!chat) {
                chat = await Chat.create({
                    users: [req.user._id, receiverId],
                    isGroupChat: false,
                })

                await ChatParticipant.insertMany([
                    {
                        chat: chat._id,
                        user: req.user._id,
                    },
                    {
                        chat: chat._id,
                        user: receiverId,
                    },
                ])

                chat = await chat.populate("users", "-password");
            }
        }
        else {
            return res.status(400).json({ message: "ChatID or ReceiverID required" });
        }

        let message = await Message.create({
            sender: req.user._id,
            content,
            chat: chat._id,
            readBy: [req.user._id],
        });

        chat.latestMessage = message._id;

        await Promise.all([
            chat.save(),

            message.populate([
                { path: "sender", select: "-password" },
                {
                    path: "chat",
                    populate: {
                        path: "users",
                        select: "-password",
                    },
                },
            ]),

            ChatParticipant.updateOne(
                {
                    chat: chat._id,
                    user: req.user._id,
                },
                {
                    $set: {
                        lastSeenMessage: message._id,
                        lastSeenAt: message.createdAt,
                        unreadCount: 0,
                    },
                }
            ),

            ChatParticipant.updateMany(
                {
                    chat: chat._id,
                    user: { $ne: req.user._id },
                },
                {
                    $inc: {
                        unreadCount: 1,
                    },
                }
            ),
        ]);

        req.io.to(chat._id.toString()).emit("newMessage", message);

        res.status(201).json(message);

    } catch (error) {
        console.error(error);

        res.status(error.statusCode || 500).json({
            message: error.message || "Error sending message",
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const { chatId, before, limit = 50 } = req.query;

        const chat = await ensureChatAccess(chatId, req.user._id);

        const query = { chat: chatId };

        if (before) {
            query._id = { $lt: before };
        }

        const messages = await Message.find(query)
            .populate('sender', 'username email')
            .sort({ _id: -1 })
            .limit(Number(limit));

        res.json(messages.reverse());
    } catch (error) {
        console.error(error);

        res.status(error.statusCode || 500).json({
            message: error.message || "Error fetching message",
        });
    }
};

module.exports = {
    sendMessage,
    getMessages,
};