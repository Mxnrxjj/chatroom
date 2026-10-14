import { Monitor, Moon, Sun } from "lucide-react";
import SettingsCard from "../../components/settings/SettingsCard";
import SettingsSection from "../../components/settings/SettingsSection";
import { useTheme } from "../../context/ThemeContext";

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsSection>
      <div>
        <Monitor size={42} className="mb-4 text-primary-500 dark:text-white" />

        <h1 className="text-3xl font-bold dark:text-white">Appearance</h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Customize how Pigeon looks.
        </p>
      </div>

      <SettingsCard
        title="Theme"
        description="Choose your preferred appearance."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => setTheme("light")}
            className={`rounded-2xl p-6 transition border-2 ${
              theme === "light"
                ? "border-primary-500 bg-primary-500/10"
                : "border-gray-300 dark:border-[#2A3942]"
            }`}
          >
            <Sun className="mx-auto mb-3 text-primary-500" />
            <p className="font-medium dark:text-white">Light</p>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`rounded-2xl p-6 transition border-2 ${
              theme === "dark"
                ? "border-white bg-primary-500/10"
                : "border-gray-300 dark:border-[#2A3942]"
            }`}
          >
            <Moon className="mx-auto mb-3 text-primary-500 dark:text-white" />
            <p className="font-medium dark:text-white">Dark</p>
          </button>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
