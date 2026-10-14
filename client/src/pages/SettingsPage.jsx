import { Outlet } from "react-router-dom";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import SettingsHeader from "../components/settings/SettingsHeader";

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#111B21]">
      <SettingsSidebar />

      <div className="flex flex-1 flex-col">
        <SettingsHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
