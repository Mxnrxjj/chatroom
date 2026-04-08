export function createMessage({
    conversationId,
    senderId,
    senderName,
    text,
}) {
    return {
        id: crypto.randomUUID(),
        conversationId,
        senderId,
        senderName,
        payload: {
            type: "text",
            content: text,
        },
        status: "sent",
        createdAt: new Date().toISOString(),
        meta: {
            encrypted: false,
        },
    };
}