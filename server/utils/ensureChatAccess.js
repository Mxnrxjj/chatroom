const Chat = require("../models/Chat");

const ensureChatAccess = async (chatId, userId) => {
    const chat = await Chat.findById(chatId);

    if (!chat) {
        const error = new Error("Chat not found");
        error.statusCode = 404;
        throw error;
    }

    const isMember = chat.users.some(
        (id) => id.toString() === userId.toString()
    );

    if (!isMember) {
        const error = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
    }

    return chat;
};


module.exports = ensureChatAccess;