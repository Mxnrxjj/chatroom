import { useEffect, useState, useRef, useLayoutEffect } from "react";
import socket from "../socket/socket";
import MessageList from "../components/layout/MessageList";
import SideBar from "../components/layout/Sidebar";
import ChatHeader from "../components/layout/ChatHeader";
import MessageInput from "../components/layout/MessageInput";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { sendMessage, fetchMessages as fetchMessagesAPI } from "../api/message";
import { Lock, Bird } from "lucide-react";
import { markChatAsRead } from "../api/chat";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { user: currentUser, token } = useAuth();
  const {
    selectedChat,
    setSelectedChat,
    setChats,
    setTempChat,
    markReadLocally,
  } = useChat();

  // Clear messages on chat change
  useEffect(() => {
    setMessages([]);
  }, [selectedChat?._id]);

  // Fetch messages for existing chats
  useEffect(() => {
    if (!selectedChat?._id || selectedChat.isTemporary) return;

    const fetchMessages = async () => {
      try {
        const data = await fetchMessagesAPI(selectedChat._id);
        setMessages(data);
        setHasMore(data.length === 50);

        const markRead = async () => {
          await markChatAsRead(selectedChat._id);
          markReadLocally(selectedChat._id);
        };

        markRead();

        console.log("Fetched messages:", data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedChat?._id]);

  // Join socket room + listen for new messages
  useEffect(() => {
    if (!selectedChat?._id || selectedChat.isTemporary) return;

    // Listen for new messages
    const handleNewMessage = (msg) => {
      console.log("Received new message:", msg);
      if (msg.sender._id === currentUser._id) return;
      if (msg.chat._id !== selectedChat._id) return;

      const el = containerRef.current;

      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      console.log(distanceFromBottom);
      const isNearBottom = distanceFromBottom < 450;

      setMessages((prev) => [...prev, msg]);

      if (isNearBottom) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedChat?._id, currentUser._id]);

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const payload = selectedChat.isTemporary
      ? { content: message, receiverId: selectedChat.user._id }
      : { content: message, chatId: selectedChat._id };

    const newMsg = await sendMessage(payload);

    // If was temporary, update chat list with real chat
    if (selectedChat.isTemporary) {
      setChats((prev) => {
        const updated = [newMsg.chat, ...prev];
        console.log("Updated Chats:", updated);
        return updated;
      });
      setTempChat(null);
      setSelectedChat(newMsg.chat);
    }

    setMessages((prev) => [...prev, newMsg]);
    requestAnimationFrame(() => {
      const el = containerRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
    setMessage("");
  };

  // Typing handler
  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!selectedChat?._id) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        chatId: selectedChat._id,
      });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedChat._id,
      });
      setIsTyping(false);
    }, 1500);
  };

  const loadOlderMessages = async () => {
    if (loadingMore || !hasMore || messages.length === 0) return;

    setLoadingMore(true);

    const el = containerRef.current;
    const previousHeight = el.scrollHeight;

    const oldest = messages[0];

    const older = await fetchMessagesAPI(selectedChat._id, oldest._id);

    if (older.length < 50) {
      setHasMore(false);
    }

    setMessages((prev) => [...older, ...prev]);

    requestAnimationFrame(() => {
      const newHeight = el.scrollHeight;

      el.scrollTop += newHeight - previousHeight;
    });

    setLoadingMore(false);
  };

  const handleScroll = () => {
    const el = containerRef.current;

    if (el.scrollTop < 100) {
      loadOlderMessages();
    }
  };

  const initialLoad = useRef(true);

  useLayoutEffect(() => {
    if (!messages.length || !initialLoad.current) return;

    const el = containerRef.current;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });

    initialLoad.current = false;
  }, [messages]);

  useEffect(() => {
    initialLoad.current = true;
  }, [selectedChat?._id]);

  return (
    <div className="flex h-screen">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {selectedChat ? (
        // ChatArea
        <div className="flex flex-col flex-1 dark:bg-[#111B21]">
          <ChatHeader
            chat={selectedChat}
            setSelectedChat={setSelectedChat}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          <MessageList
            messages={messages}
            currentUser={currentUser}
            containerRef={containerRef}
            handleScroll={handleScroll}
          />

          <MessageInput
            message={message}
            setMessage={setMessage}
            handleTyping={handleTyping}
            handleSendMessage={handleSendMessage}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50  w-full h-full text-center p-8 dark:bg-[#111B21]">
          {/* Icon Circle */}
          <div className="w-24 h-24 mb-6 text-primary-500 bg-white rounded-full shadow-xl flex items-center justify-center ring-4 ring-primary-50 dark:ring-primary-900/20">
            <Bird className="w-12 h-12" />
          </div>

          {/* App Name */}
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-3 tracking-tight">
            Pigeon
          </h1>

          {/* Subtitle */}
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            Select a chat to start messaging in an efficient way.
          </p>

          {/* Footer Badge */}
          <div className="mt-8 flex gap-3">
            {/* <span className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-100 dark:bg-zinc-900 px-4 py-2 rounded-full">
              <Lock className="w-3.5 h-3.5" />
              End-to-end encrypted
            </span> */}
          </div>
        </div>
      )}
    </div>
  );
}
export default Chat;
