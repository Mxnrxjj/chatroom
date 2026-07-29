import { useState } from "react";
import { changeChatPin } from "../../api/chat";

export default function ChangePinModal({ open, onClose }) {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (newPin !== confirmPin) {
      return alert("PINs do not match.");
    }

    try {
      await changeChatPin(currentPin, newPin);

      alert("PIN changed successfully.");

      handleClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClose = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="w-96 rounded-xl bg-white p-6 dark:bg-[#202C33]">
        <h2 className="text-xl font-semibold mb-4">Change PIN</h2>

        <input
          type="password"
          placeholder="Current PIN"
          value={currentPin}
          onChange={(e) => setCurrentPin(e.target.value)}
          className="w-full mb-3 rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="New PIN"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
          className="w-full mb-3 rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="Confirm New PIN"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
          className="w-full mb-5 rounded-lg border p-3"
        />

        <div className="flex justify-end gap-3">
          <button onClick={handleClose}>Cancel</button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
