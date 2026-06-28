import { useState } from "react";
import { Pencil, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SettingsCard from "../../components/settings/SettingsCard";
import SettingsSection from "../../components/settings/SettingsSection";
// import { updateProfile } from "../../api/user";
// import { toast } from "react-toastify";

export default function ProfileSettings() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    username: user.username,
    bio: user.bio || "",
    avatar: user.avatar || "",
  });

  const [editingAvatar, setEditingAvatar] = useState(false);

  const hasChanges =
    form.username !== user.username ||
    form.bio !== (user.bio || "") ||
    form.avatar !== (user.avatar || "");

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      //   const updatedUser = await updateProfile(form);
      //   setUser(updatedUser);
      //   toast.success("Profile updated successfully!");
    } catch (error) {
      //   toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <SettingsSection>
      {/* Hero */}

      <SettingsCard
        title="Personal Information"
        description="This information is visible to other users."
      >
        {/* Avatar */}

        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <img
              src={form.avatar}
              alt={form.username}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary-500/20 shadow"
              onError={(e) => {
                e.target.src = "https://placehold.co/112x112?text=Avatar";
              }}
            />

            <button
              onClick={() => setEditingAvatar((prev) => !prev)}
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition"
            >
              <Pencil size={16} className="mx-auto" />
            </button>
          </div>

          <h3 className="mt-4 text-lg font-semibold dark:text-white">
            @{form.username}
          </h3>
        </div>

        {/* Avatar URL */}

        {editingAvatar && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Avatar URL
            </label>

            <input
              type="url"
              placeholder="https://..."
              value={form.avatar}
              onChange={(e) => handleChange("avatar", e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-primary-500 dark:border-[#2A3942] dark:bg-[#111B21] dark:text-white"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Username */}

          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Username
            </label>

            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-primary-500 dark:border-[#2A3942] dark:bg-[#111B21] dark:text-white"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Email
            </label>

            <input
              value={user.email}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 dark:border-[#2A3942] dark:bg-[#17232B] dark:text-gray-400"
            />
          </div>
        </div>

        {/* Bio */}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium dark:text-gray-300">
            Bio
          </label>

          <textarea
            rows={4}
            maxLength={150}
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-primary-500 dark:border-[#2A3942] dark:bg-[#111B21] dark:text-white"
          />

          <div className="mt-2 text-right text-xs text-gray-500">
            {form.bio.length}/150
          </div>
        </div>

        {/* Save */}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
