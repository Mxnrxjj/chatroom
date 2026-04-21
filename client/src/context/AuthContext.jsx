import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logout as logutUtil } from "../utils/auth";
import socket from "../socket/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);

      socket.auth = {
        token: storedUser.token,
      };

      if (!socket.connected) {
        socket.connect();
      }
    }
  }, []);

  const logout = () => {
    // Clear socket auth and disconnect
    logutUtil();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
