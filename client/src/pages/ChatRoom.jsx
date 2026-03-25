import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket";

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, roomName } = location.state;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Join room when component loads
  useEffect(() => {
    socket.emit("join-room", { username, roomName });
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", ({ username }) => {
      setTypingUsers((prev) => [...new Set([...prev, username])]);
    });

    socket.on("stop-typing", ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      username,
      roomName,
      message,
    };

    socket.emit("send-message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessage("");
  };
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white p-3 text-center font-bold">
        Room: {roomName} | User: {username}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 ${
              msg.username === username ? "text-right" : "text-left"
            }`}
          >
            <span className="font-bold">{msg.username}: </span>
            <span className="bg-white px-3 py-1 rounded shadow">
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      {/* Typing Indicator */}
      <div className="h-6 px-3 text-sm text-gray-500">
        {typingUsers.length > 0 && (
          <span>{typingUsers.join(", ")} is typing...</span>
        )}
      </div>
      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit("typing", { username, roomName });

            setTimeout(() => {
              socket.emit("stop-typing", { username, roomName });
            }, 1000);
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
