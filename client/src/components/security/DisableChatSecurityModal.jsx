import { useState } from "react";
import { disableChatSecurity } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";

export default function DisableChatSecurityModal({ open, onClose }) {
  const [pin, setPin] = useState("");
  const { updateUser } = useAuth();

  if (!open) return null;

  const handleDisable = async () => {
    try {
      const res = await disableChatSecurity(pin);

      updateUser(res.user);

      handleClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClose = () => {
    setPin("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="w-96 rounded-xl bg-white p-6 dark:bg-[#202C33]">
        <h2 className="text-xl font-semibold mb-2">Disable Chat Security</h2>

        <p className="mb-5 text-sm text-gray-500">
          Enter your PIN to disable chat security.
        </p>

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Current PIN"
          className="w-full rounded-lg border p-3 mb-5"
        />

        <div className="flex justify-end gap-3">
          <button onClick={handleClose}>Cancel</button>

          <button
            onClick={handleDisable}
            className="rounded-lg bg-red-500 px-4 py-2 text-white"
          >
            Disable
          </button>
        </div>
      </div>
    </div>
  );
}
