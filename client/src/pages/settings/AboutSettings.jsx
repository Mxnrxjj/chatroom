import { Info, Globe, GitBranch } from "lucide-react";
import SettingsCard from "../../components/settings/SettingsCard";
import SettingsSection from "../../components/settings/SettingsSection";

export default function AboutSettings() {
  return (
    <SettingsSection>
      <div>
        <Info size={42} className="mb-4 text-primary-500" />

        <h1 className="text-3xl font-bold dark:text-white">About</h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Information about Pigeon.
        </p>
      </div>

      <SettingsCard title="Application" description="Version and useful links.">
        <div className="space-y-5">
          <div className="flex justify-between">
            <span className="text-gray-500">Version</span>
            <span className="font-medium dark:text-white">v1.0.0</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <GitBranch size={18} />
              GitHub
            </span>

            <button className="text-primary-500 hover:underline">Open</button>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <Globe size={18} />
              Website
            </span>

            <button className="text-primary-500 hover:underline">Open</button>
          </div>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
