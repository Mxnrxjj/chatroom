const API = import.meta.env.VITE_API_URL;

// export const createOrGetChat = async (userId, token) => {
//     const res = await fetch(`${API}/chats`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId }),
//     });
//     if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Failed to create or get chat");
//     }
//     return res.json();
// }

// export const getMyChats = async (token) => {
//     const res = await fetch(`${API}/chats`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Failed to fetch chats");
//     }
//     return res.json();
// }

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