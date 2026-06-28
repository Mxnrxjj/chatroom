import { Monitor, Moon, Sun } from "lucide-react";
import SettingsCard from "../../components/settings/SettingsCard";
import SettingsSection from "../../components/settings/SettingsSection";

export default function AppearanceSettings() {
  return (
    <SettingsSection>
      <div>
        <Monitor size={42} className="mb-4 text-primary-500" />

        <h1 className="text-3xl font-bold dark:text-white">Appearance</h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Customize how Pigeon looks.
        </p>
      </div>

      <SettingsCard
        title="Theme"
        description="Choose your preferred appearance."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <button className="rounded-2xl border-2 border-primary-500 bg-primary-500/10 p-6 transition">
            <Sun className="mx-auto mb-3 text-primary-500" />
            <p className="font-medium dark:text-white">Light</p>
          </button>

          <button className="rounded-2xl border border-gray-300 dark:border-[#2A3942] p-6 hover:border-primary-500 transition">
            <Moon className="mx-auto mb-3" />
            <p className="font-medium dark:text-white">Dark</p>
          </button>

          <button className="rounded-2xl border border-gray-300 dark:border-[#2A3942] p-6 hover:border-primary-500 transition">
            <Monitor className="mx-auto mb-3" />
            <p className="font-medium dark:text-white">System</p>
          </button>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
