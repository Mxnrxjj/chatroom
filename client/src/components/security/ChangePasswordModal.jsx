import { useState } from "react";
import { changePassword } from "../../api/auth";

export default function ChangePasswordModal({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!open) return null;

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      await changePassword(currentPassword, newPassword);

      alert("Password changed successfully.");

      handleClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="w-96 rounded-xl bg-white dark:bg-[#202C33] p-6">
        <h2 className="text-xl font-semibold mb-2 dark:text-white">
          Change Password
        </h2>

        <p className="text-sm text-gray-500 mb-5">
          Enter your current password and choose a new one.
        </p>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-lg border p-3 mb-3"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-lg border p-3 mb-3"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg border p-3 mb-5"
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
