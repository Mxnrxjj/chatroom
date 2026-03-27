import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket";
import MessageList from "../components/layout/MessageList";
import SideBar from "../components/layout/Sidebar";
import ChatHeader from "../components/layout/ChatHeader";
import MessageInput from "../components/layout/MessageInput";

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, roomName } = location.state;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeRoom, setActiveRoom] = useState(null);
  const messagesEndRef = useRef(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen">
      <SideBar
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* ChatArea */}
      <div className="flex flex-col flex-1">
        <ChatHeader activeRoom={roomName} setIsSidebarOpen={setIsSidebarOpen} />

        <MessageList
          messages={messages}
          currentUser={username}
          typingUsers={typingUsers}
          activeRoom={activeRoom}
          messagesEndRef={messagesEndRef}
        />

        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
export default Chat;
