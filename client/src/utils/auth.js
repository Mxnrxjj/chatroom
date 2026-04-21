import socket from "../socket/socket";

export const setAuth = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

export const logout = () => {
    if (socket.connected) {
        socket.disconnect();
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    socket.auth = {};
};