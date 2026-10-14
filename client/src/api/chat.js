const API = import.meta.env.VITE_API_URL;

import { authFetch } from "../utils/authFetch";

export const createOrGetChat = async (userId) => {
    return authFetch(`${API}/chats`, {
        method: "POST",
        body: JSON.stringify({ userId }),
    });
};

export const getMyChats = async () => {
    return authFetch(`${API}/chats`);
};

export const markChatAsRead = async (chatId) => {
    await authFetch(`${API}/chats/${chatId}/read`, {
        method: "PUT",
    });
};

export const enableChatSecurity = async (pin) => {
    return authFetch(`${API}/chats/chat-security`, {
        method: "PUT",
        body: JSON.stringify({ pin }),
    });
};

export const changeChatPin = async (currentPin, newPin) => {
    return authFetch(`${API}/chats/chat-security/pin`, {
        method: "PUT",
        body: JSON.stringify({ currentPin, newPin }),
    });
};

export const disableChatSecurity = async (pin) => {
    return authFetch(`${API}/chats/chat-security/disable`, {
        method: "PUT",
        body: JSON.stringify({ pin }),
    });
};

export const lockChat = async (chatId) => {
    return authFetch(`${API}/chats/${chatId}/lock`, {
        method: "PUT",
    });
};

export const unlockChat = async (chatId) => {
    return authFetch(`${API}/chats/${chatId}/unlock`, {
        method: "PUT",
    });
};

export const verifyChatPin = async (pin) => {
    return authFetch(`${API}/chats/chat-security/verify`, {
        method: "POST",
        body: JSON.stringify({ pin }),
    });
};

export const deleteChat = async (chatId) => {
    return authFetch(`${API}/chats/${chatId}`, {
        method: "DELETE",
    });
};