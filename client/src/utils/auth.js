import socket from "../socket/socket";

export const setAuth = (data) => {
    localStorage.setItem("token", data.token);

    const user = {
        _id: data._id,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        bio: data.bio,
        chatSecurity: data.chatSecurity,
    };
    localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (err) {
        console.error("Corrupted user in storage");
        localStorage.removeItem("user");
        return null;
    }
};

export const logout = () => {
    socket.disconnect();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    socket.auth = {};
};