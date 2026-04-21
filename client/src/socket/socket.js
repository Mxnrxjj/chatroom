import { io } from "socket.io-client";

const socket = io("http://192.168.31.239:3000", {
    autoConnect: false,
});

export default socket;