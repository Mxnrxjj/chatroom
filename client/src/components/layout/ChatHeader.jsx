import React from "react";
import { ChevronLeft, Video, PhoneCall } from "lucide-react";
import { getChatName } from "../../utils/chatName";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { formattedTime } from "../../utils/time";
import { useState } from "react";
import ChatProfileCard from "../layout/ChatProfileCard";

function ChatHeader({ chat, setSelectedChat, setIsSidebarOpen }) {
  const { getUserPresence, selectedChat, getTypingUsers } = useChat();
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (!chat || !chat.users) return null;

  const chatName = getChatName(chat, user._id);
  const otherUser = chat.users.find((u) => u._id !== user._id);
  const userPresence = getUserPresence(otherUser?._id);
  const isOnline = userPresence?.status === "online";
  const lastSeen = userPresence?.lastSeen;
  const typingUsers = getTypingUsers(chat._id);

  const typingUserNames = typingUsers
    .map((typingUser) => {
      const chatUser = selectedChat.users.find((u) => u._id === typingUser._id);
      return chatUser?.username;
    })
    .filter(Boolean);

  let typingText = "";

  if (typingUserNames.length === 1) {
    typingText = `${typingUserNames[0]} is typing...`;
  } else if (typingUserNames.length === 2) {
    typingText = `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
  } else if (typingUserNames.length > 2) {
    typingText = `${typingUserNames.length} people are typing...`;
  }

  return (
    <>
      <div className="py-3 border-b border-gray-300 flex items-center px-4 bg-white dark:bg-[#111B21] dark:text-white">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            className="hover:bg-gray-200 hover:text-blue-500 p-2 rounded-full transition"
            onClick={() => {
              setIsSidebarOpen(true);
              setSelectedChat(null);
            }}
          >
            <ChevronLeft />
          </button>

          <div
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-500 text-white">
              {(() => {
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
              })()}
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-bold">{chatName}</h2>

              <div className="text-sm text-gray-500">
                {typingText.length > 0
                  ? `${typingText}`
                  : isOnline
                    ? "Online"
                    : lastSeen
                      ? `Last Seen ${formattedTime(lastSeen)}`
                      : "Offline"}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1" />
        <div className="flex items-center gap-2 mr-2 hidden">
          <button className="text-white bg-blue-500 rounded-full p-2 hover:cursor-pointer ripple">
            <PhoneCall size={22} />
          </button>
          <button className="text-white bg-green-500 rounded-full p-2 hover:cursor-pointer ripple">
            <Video size={22} />
          </button>
        </div>
      </div>
      <ChatProfileCard
        open={showProfile}
        onClose={() => setShowProfile(false)}
        user={otherUser}
        chatId={chat._id}
        isLocked={chat.isLocked}
        onStatusChange={(locked) => {
          setSelectedChat((prev) => ({
            ...prev,
            isLocked: locked,
          }));
        }}
      />
    </>
  );
}

export default ChatHeader;
