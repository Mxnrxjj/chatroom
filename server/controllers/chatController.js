const mongoose = require("mongoose");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const ensureChatAccess = require("../utils/ensureChatAccess");
const ChatParticipant = require("../models/ChatParticipant");

const createOrGetChat = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "UserID required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user id",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const chatKey = [
            req.user._id.toString(),
            userId.toString()
        ]
            .sort()
            .join("_");

        // Check if chat already exists

        let chat = await Chat.findOne({
            chatKey,
            isGroupChat: false,
            // users: { $all: [req.user._id, userId] },
        }).populate("users", "-password");

        if (chat) {
            return res.json(chat);
        }

        // Create new chat
        try {
            chat = await Chat.create({
                users: [req.user._id, userId],
                isGroupChat: false,
            });

            await ChatParticipant.insertMany([
                {
                    chat: chat._id,
                    user: req.user._id,
                },
                {
                    chat: chat._id,
                    user: userId,
                },
            ])

            chat = await chat.populate("users", "-password");

            res.status(201).json(chat);
        } catch (error) {
            if (error.code === 11000) {
                chat = await Chat.findOne({
                    chatKey,
                    isGroupChat: false,
                }).populate("users", "-password");

                return res.json(chat);
            }

            throw error;
        }

    } catch (error) {
        console.error(error);

        res.status(error.statusCode || 500).json({
            message: error.message || "Server error",
        });
    }
};

const getMyChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate({
                path: "latestMessage",
                populate: {
                    path: "sender",
                    select: "-password",
                },
            })
            .sort({ updatedAt: -1 });

        const participants = await ChatParticipant.find({
            user: req.user._id,
        });

        const participantMap = new Map();

        participants.forEach((participant) => {
            participantMap.set(
                participant.chat.toString(),
                participant
            );
        });

        const chatsWithUnread = await Promise.all(
            chats.map(async (chat) => {
                const participant =
                    participantMap.get(chat._id.toString());

                return {
                    ...chat.toObject(),
                    unreadCount: participant?.unreadCount ?? 0,
                };
            })
        );

        res.json(chatsWithUnread);
    } catch (error) {
        console.error(error);

        res.status(error.statusCode || 500).json({
            message: error.message || "Server error",
        });
    }
}

const markChatAsRead = async (req, res) => {
    try {

        const { chatId } = req.params;

        const chat = await ensureChatAccess(chatId, req.user._id);

        if (!chat.latestMessage) {
            return res.json({ success: true });
        }

        const participant = await ChatParticipant.findOne({
            chat: chatId,
            user: req.user._id,
        });

        if (!participant) {
            return res.status(400).json({
                message: "Participant not found",
            });
        }

        const latestMessage = await Message.findById(chat.latestMessage)
            .select("createdAt");

        participant.lastSeenMessage = chat.latestMessage;
        participant.lastSeenAt = latestMessage.createdAt;
        participant.unreadCount = 0;

        await participant.save();

        await Promise.all([
            participant.save(),
            Message.updateMany(
                {
                    chat: chat._id,
                    sender: { $ne: req.user._id },
                    readBy: { $ne: req.user._id },
                },
                {
                    $addToSet: {
                        readBy: req.user._id,
                    },
                }
            ),
        ]);

        res.json({
            success: true,
        });


    } catch (error) {
        console.error(error);

        res.status(error.statusCode || 500).json({
            message: error.message || "Server error",
        });
    }
}

module.exports = {
    createOrGetChat,
    getMyChats,
    markChatAsRead,
};