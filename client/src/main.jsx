import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <ChatProvider>
        <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-[#0B141A]">
          <App />
        </div>
      </ChatProvider>
    </AuthProvider>
  </ThemeProvider>,
);
