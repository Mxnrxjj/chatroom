import { User, Shield, Palette, Info, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  {
    title: "Account",
    items: [
      {
        label: "Profile",
        icon: User,
        path: "/settings/profile",
      },
      {
        label: "Security",
        icon: Shield,
        path: "/settings/security",
      },
      {
        label: "Appearance",
        icon: Palette,
        path: "/settings/appearance",
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        label: "About",
        icon: Info,
        path: "/settings/about",
      },
    ],
  },
];

export default function SettingsSidebar() {
  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 dark:border-[#2A3942] bg-white dark:bg-[#202C33] flex flex-col">
      <div className="px-6 py-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account
        </p>
      </div>

      <nav className="flex-1 px-3">
        {menu.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="px-3 mb-2 text-xs uppercase tracking-wider text-gray-400">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 transition-all
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-500 shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#2A3942]"
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200 dark:border-[#2A3942] p-3">
        <NavLink
          to="/settings/delete"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 transition-all
            ${
              isActive
                ? "bg-red-500 text-white"
                : "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            }`
          }
        >
          <Trash2 size={20} />
          Delete Account
        </NavLink>
      </div>
    </aside>
  );
}
