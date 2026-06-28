import React from "react";

function DateSeparator({ label }) {
  return (
    <div className="flex items-center justify-center my-5">
      <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
        {label}
      </span>
    </div>
  );
}

export default DateSeparator;
