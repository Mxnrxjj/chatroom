import React from "react";
import { useChat } from "../../context/ChatContext";

function MessageHeader({ currentUser }) {
  const { selectedChat } = useChat();
  const otherUser = selectedChat?.users.find((u) => u._id !== currentUser._id);

  return (
    <div className="flex flex-col items-center mb-6">
      <img
        src={otherUser.avatar}
        alt="profile"
        className="w-20 h-20 rounded-full mb-2 border-2 border-margin border-blue-500"
      />
      <p className="text-gray-400 text-sm">
        This is the beginning of your conversation with {otherUser.username}
      </p>
    </div>
  );
}

export default MessageHeader;
