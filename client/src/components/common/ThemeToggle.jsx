import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 hover:bg-gray-200 hover:cursor-pointer dark:hover:text-[#111B21] transition"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
