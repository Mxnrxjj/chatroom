import { AlertTriangle } from "lucide-react";
import SettingsCard from "../../components/settings/SettingsCard";
import SettingsSection from "../../components/settings/SettingsSection";

export default function DeleteAccount() {
  return (
    <SettingsSection>
      <div>
        <AlertTriangle size={42} className="mb-4 text-red-500" />

        <h1 className="text-3xl font-bold text-red-500">Delete Account</h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          This action is permanent and cannot be undone.
        </p>
      </div>

      <SettingsCard
        title="Danger Zone"
        description="Deleting your account permanently removes all your data."
      >
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-5 border border-red-200 dark:border-red-500/20">
          <h3 className="font-semibold text-red-600 mb-3">
            What will be deleted?
          </h3>

          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>Your profile</li>
            <li>All your chats</li>
            <li>All your messages</li>
            <li>All media shared by you</li>
            <li>Your account permanently</li>
          </ul>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 transition">
            Delete Account
          </button>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
