import MessageBubble from "../chat/MessageBubble";
import MessageHeader from "../chat/MessageHeader";
import TypingIndicator from "../chat/TypingIndicator";
import DateSeparator from "../chat/DateSeparator";
import { useChat } from "../../context/ChatContext";
import { getMessageDateLabel } from "../../utils/dateSeparator";
import { Fragment } from "react";

function MessageList({ messages, currentUser, containerRef, handleScroll }) {
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 pt-20"
    >
      <MessageHeader currentUser={currentUser} />
      {messages.map((msg, index) => {
        const currentLabel = getMessageDateLabel(msg.createdAt);
        const previousLabel =
          index > 0 ? getMessageDateLabel(messages[index - 1].createdAt) : null;

        const isMe = msg.sender._id === currentUser._id;

        const isFirstInGroup =
          index === 0 || messages[index - 1].sender._id !== msg.sender._id;

        const isLastInGroup =
          index === messages.length - 1 ||
          messages[index + 1].sender._id !== msg.sender._id;

        return (
          <Fragment key={msg._id}>
            {currentLabel !== previousLabel && (
              <DateSeparator label={currentLabel} />
            )}
            <MessageBubble
              msg={msg}
              isMe={isMe}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
            />
          </Fragment>
        );
      })}

      <div />
    </div>
  );
}

export default MessageList;
