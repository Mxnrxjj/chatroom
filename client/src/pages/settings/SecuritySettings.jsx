import { useState } from "react";
import { ShieldCheck, Lock, KeyRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { enableChatSecurity } from "../../api/chat";

import SettingsSection from "../../components/settings/SettingsSection";
import SettingsCard from "../../components/settings/SettingsCard";
import PinSetupModal from "../../components/security/PinSetupModal";
import ChangePinModal from "../../components/security/ChangePinModal";
import DisableChatSecurityModal from "../../components/security/DisableChatSecurityModal";
import ChangePasswordModal from "../../components/security/ChangePasswordModal";

export default function SecuritySettings() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);
  const [firstPin, setFirstPin] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { user, updateUser } = useAuth();
  const chatLockEnabled = user.chatSecurity?.enabled;

  const closeModal = () => {
    setShowPinModal(false);
    setConfirmMode(false);
    setFirstPin("");
  };

  const handlePinComplete = async (pin) => {
    if (!confirmMode) {
      setFirstPin(pin);
      setConfirmMode(true);
      return;
    }

    if (pin !== firstPin) {
      alert("PINs do not match.");
      setConfirmMode(false);
      setFirstPin("");
      return;
    }

    try {
      const data = await enableChatSecurity(pin);

      updateUser(data.user);

      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <SettingsSection>
        {/* Hero */}

        <div>
          <ShieldCheck size={42} className="mb-4 text-primary-500" />

          <h1 className="text-3xl font-bold dark:text-white">Security</h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Protect your account and your private conversations.
          </p>
        </div>

        {/* Chat Lock */}

        <SettingsCard
          title="Chat Lock"
          description="Protect locked chats with a 4-digit PIN."
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary-500/10 p-3">
                <Lock size={22} className="text-primary-500" />
              </div>

              <div>
                <p className="font-semibold dark:text-white">Status</p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {chatLockEnabled ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>

            {!chatLockEnabled ? (
              <button
                onClick={() => setShowPinModal(true)}
                className="rounded-xl bg-blue-500 px-5 py-2.5 font-medium text-white transition hover:cursor-pointer"
              >
                Enable
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowChangePinModal(true)}
                  className="rounded-xl border border-gray-300 dark:border-[#2A3942] px-5 py-2.5 hover:bg-gray-100 dark:hover:bg-[#2A3942]"
                >
                  Change PIN
                </button>

                <button
                  onClick={() => setShowDisableModal(true)}
                  className="rounded-xl bg-red-500 px-5 py-2.5 text-white hover:bg-red-600"
                >
                  Disable
                </button>
              </div>
            )}
          </div>
        </SettingsCard>

        {/* Password */}

        <SettingsCard
          title="Password"
          description="Update your account password."
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-yellow-500/10 p-3">
                <KeyRound size={22} className="text-yellow-500" />
              </div>

              <div>
                <p className="font-semibold dark:text-white">
                  Account Password
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Keep your password secure and unique.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-xl border border-gray-300 dark:border-[#2A3942] px-5 py-2.5 hover:bg-gray-100 dark:hover:bg-[#2A3942]"
            >
              Change Password
            </button>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* PIN Modal */}

      <PinSetupModal
        open={showPinModal}
        title={confirmMode ? "Confirm PIN" : "Create PIN"}
        description={
          confirmMode
            ? "Enter your PIN again to confirm."
            : "Create a 4-digit PIN to protect locked chats."
        }
        onClose={closeModal}
        onComplete={handlePinComplete}
      />

      <ChangePinModal
        open={showChangePinModal}
        onClose={() => setShowChangePinModal(false)}
      />

      <DisableChatSecurityModal
        open={showDisableModal}
        onClose={() => setShowDisableModal(false)}
      />

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
