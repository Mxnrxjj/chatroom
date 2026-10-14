import { authFetch } from "../utils/authFetch";
const API = import.meta.env.VITE_API_URL;

export const sendMessage = async (payload) => {
    const { content, chatId, receiverId } = payload;

    return authFetch(`${API}/messages`, {
        method: "POST",
        body: JSON.stringify({
            content,
            chatId,
            receiverId,
        }),
    });
};

export const fetchMessages = async (
    chatId,
    before = null,
    limit = 50
) => {
    let url = `${API}/messages?chatId=${chatId}&limit=${limit}`;

    if (before) {
        url += `&before=${encodeURIComponent(before)}`
    }

    return authFetch(url);
};