import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getToken, logout as logutUtil } from "../utils/auth";
import socket from "../socket/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    const storedToken = getToken();

    if (storedToken && !storedUser) {
      logout();
      return;
    }

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setIsAuthReady(true);
  }, []);

  // Socket sync with token
  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Error handelling
  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message === "Unauthorized") {
        logout();
        window.location.href = "/login";
      }
    });

    return () => {
      socket.off("connect_error");
    };
  }, []);

  const logout = () => {
    // Clear socket auth and disconnect
    logutUtil();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, logout, isAuthReady }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
