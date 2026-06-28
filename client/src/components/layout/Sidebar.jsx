import React, { useEffect, useState, useRef } from "react";
import { Edit, Search, Settings, MessageCirclePlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchResults } from "../../api/user";
import { useChat } from "../../context/ChatContext";
import { getChatName } from "../../utils/chatName";
import ThemeToggle from "../common/ThemeToggle";

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [showSettings, setShowSettings] = React.useState(false);
  const [sidebarWidth] = React.useState(320); // removed setter since never used

  // Search state
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const latestSearchRef = useRef(""); // proper race condition fix

  const {
    chats,
    selectedChat,
    setSelectedChat,
    setTempChat,
    getUserPresence,
    getTypingUsers,
  } = useChat();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length < 2) {
        setResults([]);
        return;
      }
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = async () => {
    latestSearchRef.current = search; // track latest
    try {
      setLoading(true);
      const data = await fetchResults(search);
      if (latestSearchRef.current === search) {
        // only update if still latest
        setResults(data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = (user) => {
    // only match 1-1 chats

    const safeChats = Array.isArray(chats) ? chats : [];

    const existingChat = safeChats.find(
      (chat) => !chat.isGroupChat && chat.users.some((u) => u._id === user._id),
    );

    if (existingChat) {
      setSelectedChat(existingChat);
      setSearch(""); // clear search after selection
      return;
    }

    const temp = {
      _id: "temp_" + user._id,
      user,
      isTemporary: true,
    };

    setTempChat(temp);
    setSelectedChat(temp);
    setSearch(""); // clear search after selection
  };

  const unreadCount = (chat, userId) => {
    const lastSeen = chat.lastSeen.find((s) => s.user.toString() === userId);
    if (!lastSeen) return 0;

    const late = 1;
  };

  const formattedTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (diff < 60000) return "Just now";

    if (minutes < 60) return `${minutes}m ago`;

    if (hours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    if (days < 7) {
      return date.toLocaleDateString([], {
        weekday: "long",
      });
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const [tab, setTab] = useState("All");
  const handleTabChange = (changeTab) => {
    if (tab === changeTab) return;
    setTab(changeTab);
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        id="sidebar"
        className={`
          fixed md:static top-0 left-0 flex flex-col h-full bg-white dark:bg-[#111B21] dark:text-white
          border-r border-gray-300 z-50 transform transition-transform duration-300

          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{ width: "360px" }}
      >
        {/* Header */}
        <div className="relative mb-auto p-4 border-b border-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-300 text-white rounded-full overflow-hidden flex border border-blue-500 items-center justify-center font-semibold">
              {(() => {
                if (currentUser?.avatar) {
                  return (
                    <img
                      src={currentUser.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover block"
                    />
                  );
                }

                return (
                  <span className="text-sm font-medium">
                    {currentUser?.username?.charAt(0)?.toUpperCase()}
                  </span>
                );
              })()}
            </div>
            <p className="text-sm font-semibold">{currentUser?.username}</p>
          </div>
          <div className="flex items-center relative gap-1">
            <ThemeToggle />
            <button
              className={`p-2 hover:bg-gray-200 dark:hover:text-[#111B21] rounded-full transition-transform duration-300 
              ${showSettings ? "rotate-90" : ""}`}
              onClick={() => setShowSettings((prev) => !prev)}
            >
              <MessageCirclePlus className="hover:cursor-pointer" size={20} />
            </button>
            <button
              className={`p-2 hover:bg-gray-200 dark:hover:text-[#111B21] rounded-full transition-transform duration-300 
              ${showSettings ? "rotate-90" : ""}`}
              onClick={() => setShowSettings((prev) => !prev)}
            >
              <Settings className="hover:cursor-pointer" size={20} />
            </button>
          </div>

          {showSettings && (
            <div className="absolute right-4 top-14 w-40 bg-white text-black border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => {
                  navigate("/settings");
                }}
              >
                Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="p-4 relative">
          <div className="flex items-center bg-white dark:bg-gray-900 rounded-full px-2 py-1 border-2 border-gray-300 focus-within:border-blue-500">
            <Search className="text-gray-400 mr-2" />
            <input
              type="text"
              className="bg-transparent outline-none w-full"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Search Results Dropdown */}
          {search && (
            <div className="absolute top-16 left-4 right-4 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
              {loading && <p className="p-3 text-gray-500">Loading...</p>}
              {!loading && results.length === 0 && (
                <p className="p-3 text-gray-500">No users found</p>
              )}
              {results.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleSearchClick(user)}
                  className="flex items-center gap-3 p-3 hover:bg-blue-100 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full overflow-hidden flex items-center justify-center font-semibold">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {user?.username?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <span className="text-sm text-gray-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FilterTabs */}
        <div className="flex items-center gap-2 px-4 py-2">
          <button
            onClick={() => handleTabChange("All")}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              tab === "All"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            All
          </button>

          <button
            onClick={() => handleTabChange("Unread")}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              tab === "Unread"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            Unread
          </button>

          <button
            onClick={() => handleTabChange("Groups")}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              tab === "Groups"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            Groups
          </button>
        </div>

        {/* Direct Messages */}
        <div className="px-3 mt-4 flex-1 overflow-y-auto">
          {Array.isArray(chats) &&
            chats
              .filter((c) => {
                if (tab === "All") return true;
                if (tab === "Group") return c.isGroupChat;
                if (tab === "Unread") return c.unreadCount > 0;
                return true;
              })
              .map((chat) => {
                const otherUser = chat.users.find(
                  (u) => u._id !== currentUser._id,
                );
                const isSelected = selectedChat?._id === chat._id;
                const userPresence = getUserPresence(otherUser?._id);
                const isOnline = userPresence?.status === "online";
                const count = chat.unreadCount;
                const typingUsers = getTypingUsers(chat._id);
                const isTyping = typingUsers.length > 0;

                return (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
                    }`}
                  >
                    {/* Avatar + online dot */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-blue-500 text-white">
                        {(() => {
                          if (!chat.isGroupChat) {
                            const otherUser = chat.users.find(
                              (u) => u._id !== currentUser._id,
                            );

                            if (otherUser?.avatar) {
                              return (
                                <img
                                  src={otherUser.avatar}
                                  alt="avatar"
                                  className="w-full h-full object-cover"
                                />
                              );
                            }

                            return (
                              <span className="text-sm font-medium">
                                {otherUser?.username?.charAt(0)?.toUpperCase()}
                              </span>
                            );
                          }
                          if (chat.isGroupChat) {
                            if (chat.avatar) {
                              return (
                                <img
                                  src={chat.avatar}
                                  alt="avatar"
                                  className="w-full h-full object-cover"
                                />
                              );
                            }

                            return (
                              <span className="text-sm font-medium">
                                {chat.chatName?.charAt(0)?.toUpperCase()}
                              </span>
                            );
                          }
                        })()}
                      </div>
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                      )}
                      {/* {!isOnline && userPresence?.lastSeen && (
                        <p className="text-xs text-gray-400">
                          Last seen {formattedTime(userPresence.lastSeen)}
                        </p>
                      )} */}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3
                          className={`text-sm font-medium truncate ${isSelected ? "text-blue-500" : "text-gray-900 dark:text-white"}`}
                        >
                          {getChatName(chat, currentUser._id)}
                        </h3>
                        <span
                          className={`text-xs flex-shrink-0 ${count ? "text-blue-500 font-medium" : "text-gray-400"}`}
                        >
                          {formattedTime(chat.latestMessage?.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p
                          className={`text-xs truncate ${
                            typingUsers.length > 0
                              ? "text-green-500 italic"
                              : "text-gray-400"
                          }`}
                        >
                          {typingUsers.length > 0
                            ? typingUsers.length === 1
                              ? `${typingUsers[0].username} is typing...`
                              : `${typingUsers.length} people are typing...`
                            : chat.latestMessage
                              ? chat.latestMessage.content.length > 30
                                ? chat.latestMessage.content.substring(0, 30) +
                                  "…"
                                : chat.latestMessage.content
                              : "No messages yet"}
                        </p>
                        {count > 0 && (
                          <span className="flex-shrink-0 bg-blue-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                            {count > 99 ? "99+" : count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
