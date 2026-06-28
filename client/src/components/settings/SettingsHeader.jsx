import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const pages = {
  "/settings/profile": {
    title: "Profile",
    description: "Manage your personal information and profile.",
  },
  "/settings/security": {
    title: "Security",
    description: "Protect your account and chats.",
  },
  "/settings/appearance": {
    title: "Appearance",
    description: "Customize how Pigeon looks.",
  },
  "/settings/about": {
    title: "About",
    description: "Application information and version.",
  },
  "/settings/delete": {
    title: "Delete Account",
    description: "Permanently remove your account.",
  },
};

export default function SettingsHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const page = pages[location.pathname] ?? {
    title: "Settings",
    description: "",
  };

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-[#202C33] border-b border-gray-200 dark:border-[#2A3942]">
      <div className="flex items-center gap-4 px-8 py-5">
        <button
          onClick={() => navigate("/chat")}
          className="rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-[#2A3942]"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {page.title}
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {page.description}
          </p>
        </div>
      </div>
    </header>
  );
}
