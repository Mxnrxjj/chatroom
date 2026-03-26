import React from "react";
import { ChevronLeft, Video, PhoneCall } from "lucide-react";

function ChatHeader({ activeRoom, setIsSidebarOpen }) {
  return (
    <div className="h-16 border-b border-gray-300 flex items-center px-4 bg-white">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          className="hover:bg-gray-200 hover:text-blue-500 p-2 rounded-full transition"
          onClick={() => setIsSidebarOpen(true)}
        >
          <ChevronLeft />
        </button>
      </div>

      {/* Center */}
      <div className="flex-1 flex flex-col items-left px-4">
        <h2 className="text-lg font-bold">{activeRoom || "Select a room"}</h2>
        <div className="text-sm text-gray-500">3 members</div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 mr-2">
        <button className="text-white bg-blue-500 rounded-full p-2 hover:cursor-pointer ripple">
          <PhoneCall size={22} />
        </button>
        <button className="text-white bg-green-500 rounded-full p-2 hover:cursor-pointer ripple">
          <Video size={22} />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
