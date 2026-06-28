import { useEffect, useRef } from "react";

export default function PinInput({
  value,
  onChange,
  length = 4,
  masked = false,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, length);
    onChange(val);
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex justify-center gap-4 cursor-text"
    >
      <input
        ref={inputRef}
        type="password"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={handleChange}
        className="absolute opacity-0 pointer-events-none"
      />

      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={`
            w-14 h-14 rounded-xl border-2
            flex items-center justify-center
            text-2xl font-semibold
            transition
            ${
              i === value.length
                ? "border-primary-500"
                : "border-gray-300 dark:border-[#2A3942]"
            }
          `}
        >
          {value[i] ? (masked ? "•" : value[i]) : ""}
        </div>
      ))}
    </div>
  );
}
