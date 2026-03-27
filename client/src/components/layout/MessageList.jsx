import MessageBubble from "../chat/MessageBubble";
import TypingIndicator from "../chat/TypingIndicator";

function MessageList({
  messages,
  currentUser,
  typingUsers,
  activeRoom,
  messagesEndRef,
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 pt-20">
      {messages.map((msg, index) => {
        const isMe = msg.username === currentUser;

        const isFirstInGroup =
          index === 0 || messages[index - 1].username !== msg.username;

        const isLastInGroup =
          index === messages.length - 1 ||
          messages[index + 1].username !== msg.username;

        return (
          <MessageBubble
            key={index}
            msg={msg}
            isMe={isMe}
            isFirstInGroup={isFirstInGroup}
            isLastInGroup={isLastInGroup}
          />
        );
      })}

      <TypingIndicator typingUsers={typingUsers} />
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
