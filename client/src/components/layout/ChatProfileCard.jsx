import { lockChat, unlockChat } from "../../api/chat";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { deleteChat } from "../../api/chat";

export default function ChatProfileCard({
  open,
  onClose,
  user,
  chatId,
  isLocked,
  onStatusChange,
}) {
  const { user: currentUser } = useAuth();
  const { setChats, setSelectedChat } = useChat();

  if (!open || !user) return null;

  const handleToggle = async () => {
    if (!isLocked && !currentUser.chatSecurity?.enabled) {
      alert("Please enable Chat Security first.");

      onClose();

      return;
    }

    try {
      if (isLocked) {
        await unlockChat(chatId);

        setChats((prev) =>
          prev.map((chat) =>
            chat._id === chatId ? { ...chat, isLocked: false } : chat,
          ),
        );
      } else {
        await lockChat(chatId);

        setChats((prev) =>
          prev.map((chat) =>
            chat._id === chatId ? { ...chat, isLocked: true } : chat,
          ),
        );
      }

      onStatusChange?.(!isLocked);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this chat permanently?")) {
      return;
    }

    try {
      await deleteChat(chatId);

      setChats((prev) => prev.filter((chat) => chat._id !== chatId));

      setSelectedChat(null);

      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="relative w-80 rounded-xl bg-white dark:bg-[#202C33] p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#2A3942] transition"
        >
          <X size={20} />
        </button>
        <img
          src={user.avatar}
          alt={user.username}
          className="w-24 h-24 rounded-full mx-auto"
        />

        <h2 className="text-xl font-semibold text-center mt-4">
          {user.username}
        </h2>

        <p className="text-center text-gray-500 mt-2">{user.bio || "No bio"}</p>

        <button
          onClick={handleToggle}
          className={`mt-6 w-full rounded-lg py-3 text-white ${
            isLocked ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {isLocked ? "Unlock Chat" : "Lock Chat"}
        </button>

        <button
          onClick={handleDelete}
          className="mt-3 w-full rounded-lg py-3 bg-red-700 text-white hover:bg-red-800"
        >
          Delete Chat
        </button>
      </div>
    </div>
  );
}
