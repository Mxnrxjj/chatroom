import React from "react";

function Avatar({ color, initials, size = "sm" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
  };
  return (
    <div
      className={`${sizeClasses[size]} ${color} text-white rounded-full flex items-center justify-center font-semibold`}
    >
      {initials}
    </div>
  );
}

export default Avatar;
