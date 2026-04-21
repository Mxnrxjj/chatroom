const Chat = require("../models/Chat");

const createOrGetChat = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "UserID required" });
        }

        // Check if chat already exists

        let chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user._id, userId] },
        }).populate("users", "-password");

        if (chat) {
            return res.json(chat);
        }

        // Create new chat
        chat = await Chat.create({
            users: [req.user._id, userId],
        });

        chat = await chat.populate("users", "-password");

        res.status(201).json(chat);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    createOrGetChat,
    getMyChats,
};