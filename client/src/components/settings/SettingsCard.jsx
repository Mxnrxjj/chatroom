export default function SettingsCard({ title, description, children, footer }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-[#2A3942] bg-white dark:bg-[#202C33] shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}

        <div className="mt-6">{children}</div>
      </div>

      {footer && (
        <div className="border-t border-gray-200 dark:border-[#2A3942] px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}
