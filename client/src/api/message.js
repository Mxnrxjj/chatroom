// import { getToken, logout } from "../utils/auth";

// const API = import.meta.env.VITE_API_URL;
// const token = getToken();

// export const sendMessage = async (payload) => {
//     const { content, chatId, receiverId } = payload;
//     const res = await fetch(`${API}/messages`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//             content,
//             chatId,
//             receiverId
//         })
//     });

//     if (res.status === 401) {
//         logout();

//         if (window.location.pathname !== "/login") {
//             window.location.href = "/login";
//         }

//         throw new Error("Session expired");
//     }

//     if (!res.ok) {
//         throw new Error("Failed to send message");
//     }

//     const data = await res.json();
//     return data;
// }

// export const fetchMessages = async (chatId) => {
//     const res = await fetch(`${API}/messages?chatId=${chatId}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });

//     if (res.status === 401) {
//         logout();

//         if (window.location.pathname !== "/login") {
//             window.location.href = "/login";
//         }

//         throw new Error("Session expired");
//     }

//     if (!res.ok) {
//         throw new Error("Failed to fetch messages");
//     }

//     const data = await res.json();
//     return data;
// }

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