import { createContext, useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { getMyChats } from "../api/chat";
import { useAuth } from "./AuthContext";
import socket from "../socket/socket";
import { getCurrentUser } from "../utils/auth";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user: currentUser } = useAuth();
  const { token } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [tempChat, setTempChat] = useState(null);
  const [presence, setPresence] = useState([]);
  const [typingByChat, setTypingByChat] = useState({});
  const selectedChatRef = useRef(null);
  const currentUserRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Get chats
  useEffect(() => {
    const fetchUserChats = async () => {
      if (!token) return;
      try {
        const data = await getMyChats(token);
        setChats(data);
        data.forEach((chat) => {
          socket.emit("joinChat", chat._id);
        });
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    if (token) {
      fetchUserChats();
    }
  }, [token]);

  // useEffect(() => {
  //   if (chats.length === 0) return;
  //   console.log("Chats:", chats);
  // }, [chats]);

  useEffect(() => {
    socket.on("presence", (data) => {
      // console.log("Presence received:", data);
      setPresence(data);
    });

    socket.on("typing", ({ chatId, user }) => {
      {
        setTypingByChat((prev) => ({
          ...prev,
          [chatId]: [
            ...(prev[chatId] || []).filter((u) => u._id !== user._id),
            user,
          ],
        }));
      }
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      setTypingByChat((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || []).filter((u) => u._id !== userId),
      }));
    });

    socket.on("newMessage", (message) => {
      setChats((prev) => {
        const index = prev.findIndex((chat) => chat._id === message.chat._id);

        if (index === -1) {
          return [
            {
              ...message.chat,
              latestMessage: message,
            },
            ...prev,
          ];
        }

        const isMine = message.sender._id === currentUserRef.current._id;

        const isCurrentChat = selectedChatRef.current?._id === message.chat._id;

        const unreadCount = isMine
          ? prev[index].unreadCount
          : isCurrentChat
            ? 0
            : prev[index].unreadCount + 1;

        const updatedChat = {
          ...prev[index],
          latestMessage: message,
          unreadCount,
        };

        const updated = [...prev];
        updated.splice(index, 1);
        updated.unshift(updatedChat);
        return updated;
      });
    });

    return () => {
      socket.off("presence");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("newMessage");
    };
  }, []);

  const getUserPresence = (userId) => {
    return presence.find((p) => p.userId === String(userId));
  };

  const getTypingUsers = (chatId) => {
    return typingByChat[chatId] || [];
  };

  const markReadLocally = (chatId) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === chatId
          ? {
              ...chat,
              unreadCount: 0,
            }
          : chat,
      ),
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        tempChat,
        setTempChat,
        getUserPresence,
        getTypingUsers,
        markReadLocally,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
