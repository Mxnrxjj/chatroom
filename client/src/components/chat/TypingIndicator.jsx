import React from "react";

function TypingIndicator({ typingUsers }) {
  return (
    <div className="text-sm text-gray-500 mt-2">
      {typingUsers.length > 0 && `${typingUsers.join(", ")} typing...`}
    </div>
  );
}

export default TypingIndicator;
