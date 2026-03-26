import Avatar from "../chat/Avatar";
import { useMemo } from "react";
function MessageBubble({ msg, isMe, isFirstInGroup, isLastInGroup }) {
  let roundedClasses = "rounded-[20px]";
  if (isMe) {
    if (!isFirstInGroup) roundedClasses += " rounded-tr-[5px]";
    if (!isLastInGroup) roundedClasses += " rounded-br-[5px]";
  } else {
    if (!isFirstInGroup) roundedClasses += " rounded-tl-[5px]";
    if (!isLastInGroup) roundedClasses += " rounded-bl-[5px]";
  }

  const getColor = (name) => {
    const colors = [
      "bg-green-500",
      "bg-red-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }

    return colors[hash % colors.length];
  };

  const randomColor = getColor(msg.username);

  return (
    <div
      className={`flex gap-2 w-full ${isMe ? "justify-end" : "justify-start"}
      ${isFirstInGroup ? "mt-3" : "mt-1"}`}
    >
      {!isMe && (
        <div className="w-8 flex items-end">
          {isLastInGroup && (
            <Avatar
              color={randomColor}
              initials={msg.username[0].toUpperCase()}
            />
          )}
        </div>
      )}
      <div
        className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}
      >
        {isFirstInGroup && !isMe && (
          <span className="text-xs text-gray-500 ml-3 mb-1">
            {msg.username}
          </span>
        )}
        <div
          className={`px-4 py-2 shadow-sm ${roundedClasses} 
            ${isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        >
          {msg.message}
        </div>
        {isLastInGroup && isMe && (
          <span className="text-xs text-gray-400 mt-1 mr-1">Delivered</span>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
