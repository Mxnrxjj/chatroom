export function getRoomConversationId(roomName) {
    return `room_${roomName}`;
}

export function getDMConversationId(user1, user2) {
    return `dm_${[user1, user2].sort().join("_")}`;
}