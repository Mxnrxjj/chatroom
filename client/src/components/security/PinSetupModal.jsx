import { useState } from "react";
import PinInput from "./PinInput";

export default function PinSetupModal({
  open,
  onClose,
  title,
  description,
  onComplete,
}) {
  const [pin, setPin] = useState("");

  if (!open) return null;

  const handleChange = (value) => {
    setPin(value);

    if (value.length === 4) {
      onComplete(value);
      setPin("");
    }
  };

  const handleClose = () => {
    setPin("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#202C33] p-8">
        <h2 className="text-2xl font-bold dark:text-white">{title}</h2>

        <p className="mt-2 mb-8 text-gray-500 dark:text-gray-400">
          {description}
        </p>

        <PinInput value={pin} onChange={handleChange} />

        <button
          onClick={handleClose}
          className="mt-8 w-full rounded-xl border py-3"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
