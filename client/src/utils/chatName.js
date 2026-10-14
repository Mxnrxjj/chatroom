export const getChatName = (chat, currentUserId) => {
    if (!chat) return "";

    if (chat.isTemporary) {
        return chat.user.username;
    }

    if (chat.isGroupChat) {
        return chat.chatName;
    }

    const otherUser = chat.users.find((u) => u._id !== currentUserId);
    return otherUser?.username || "Unknown User";
}