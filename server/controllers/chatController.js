const mongoose = require("mongoose");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const ensureChatAccess = require("../utils/ensureChatAccess");
const ChatParticipant = require("../models/ChatParticipant");
const bcrypt = require("bcryptjs");

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
                    isLocked: participant?.chatLock?.enabled ?? false,
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

const enableChatSecurity = async (req, res) => {
    try {
        const { pin } = req.body;

        if (!/^\d{4,6}$/.test(pin)) {
            return res.status(400).json({
                message: "PIN must be 4 to 6 digits",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.chatSecurity.enabled) {
            return res.status(400).json({
                message: "Chat security is already enabled",
            });
        }

        user.chatSecurity.enabled = true;
        user.chatSecurity.pin = await bcrypt.hash(pin, 10);
        user.chatSecurity.pinChangedAt = new Date();

        await user.save();

        res.json({
            message: "Chat security enabled",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                chatSecurity: {
                    enabled: user.chatSecurity.enabled,
                },
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const changeChatPin = async (req, res) => {
    try {
        const { currentPin, newPin } = req.body;

        if (
            !/^\d{4,6}$/.test(currentPin) ||
            !/^\d{4,6}$/.test(newPin)
        ) {
            return res.status(400).json({
                message: "PIN must be 4 to 6 digits",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!user.chatSecurity.enabled) {
            return res.status(400).json({
                message: "Chat security is disabled",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPin,
            user.chatSecurity.pin
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid PIN",
            });
        }

        user.chatSecurity.pin = await bcrypt.hash(newPin, 10);
        user.chatSecurity.pinChangedAt = new Date();

        await user.save();

        res.json({
            message: "PIN changed successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


const disableChatSecurity = async (req, res) => {
    try {
        const { pin } = req.body;

        if (!/^\d{4,6}$/.test(pin)) {
            return res.status(400).json({
                message: "PIN must be 4 to 6 digits",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            pin,
            user.chatSecurity.pin
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid PIN",
            });
        }

        user.chatSecurity.enabled = false;
        user.chatSecurity.pin = null;
        user.chatSecurity.pinChangedAt = null;

        await user.save();

        await ChatParticipant.updateMany(
            { user: req.user._id },
            {
                $set: {
                    "chatLock.enabled": false,
                    "chatLock.lockedAt": null,
                },
            }
        );

        res.json({
            message: "Chat security disabled",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                chatSecurity: {
                    enabled: false,
                },
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const verifyChatPin = async (req, res) => {
    const { pin } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.chatSecurity.enabled) {
        return res.status(400).json({
            message: "Chat security is disabled",
        });
    }

    const valid = await bcrypt.compare(
        pin,
        user.chatSecurity.pin
    );

    if (!valid) {
        return res.status(400).json({
            message: "Invalid PIN",
        });
    }

    res.json({
        verified: true,
    });
};

const lockChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const participant = await ChatParticipant.findOne({
            chat: chatId,
            user: req.user._id,
        });

        if (!participant) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        participant.chatLock.enabled = true;
        participant.chatLock.lockedAt = new Date();

        await participant.save();

        res.json({
            message: "Chat locked successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const unlockChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const participant = await ChatParticipant.findOne({
            chat: chatId,
            user: req.user._id,
        });

        if (!participant) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        participant.chatLock.enabled = false;
        participant.chatLock.lockedAt = null;

        await participant.save();

        res.json({
            message: "Chat unlocked successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        await Message.deleteMany({
            chat: chatId,
        });

        await ChatParticipant.deleteMany({
            chat: chatId,
        });

        await Chat.findByIdAndDelete(chatId);

        res.json({
            message: "Chat deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    createOrGetChat,
    getMyChats,
    markChatAsRead,
    enableChatSecurity,
    changeChatPin,
    disableChatSecurity,
    verifyChatPin,
    lockChat,
    unlockChat,
    deleteChat,
};