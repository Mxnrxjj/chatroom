import React from "react";
import { Plus, SendHorizontal } from "lucide-react";

function MessageInput({ message, setMessage, sendMessage }) {
  return (
    <div className="p-4 border-t border-gray-300 inline-flex items-center gap-2">
      <button
        className="p-2 rounded-full bg-gray-200 text-gray-400 focus:text-blue-500 hover:bg-gray-300 focus:rotate-45  transition-transform"
        onClick={() => {}}
      >
        <Plus className="" />
      </button>
      <input
        type="text"
        placeholder="Message..."
        value={message}
        className="bg-gray-100 w-full text-gray-700 placeholder:text-gray-500 
                    border border-gray-300 rounded-full py-2 px-4 focus:outline-none
                    focus:ring-2 focus:ring-blue-500"
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />
      <button
        className="w-10 h-10 min-w-10 min-h-10 rounded-full 
             flex items-center justify-center 
             bg-green-500 text-white hover:cursor-pointer ripple"
        onClick={sendMessage}
      >
        <SendHorizontal size={22} />
      </button>
    </div>
  );
}

export default MessageInput;
