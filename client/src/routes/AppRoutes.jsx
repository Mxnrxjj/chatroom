import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import ChatPage from "../pages/ChatPage";

import SettingsPage from "../pages/SettingsPage";

import ProfileSettings from "../pages/settings/ProfileSettings";
import SecuritySettings from "../pages/settings/SecuritySettings";
import AppearanceSettings from "../pages/settings/AppearanceSettings";
import AboutSettings from "../pages/settings/AboutSettings";
import DeleteAccount from "../pages/settings/DeleteAccount";

import ProtectedRoute from "../components/guards/ProtectedRoute";
import PublicRoute from "../components/guards/PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<ChatPage />} />

        <Route path="/settings" element={<SettingsPage />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="appearance" element={<AppearanceSettings />} />
          <Route path="about" element={<AboutSettings />} />
          <Route path="delete" element={<DeleteAccount />} />
        </Route>
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
