import React, { createContext, useContext, useState, useCallback } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [username, setUsername] = useState(() => localStorage.getItem("rc_admin_username"));

  const login = useCallback((user) => {
    localStorage.setItem("rc_admin_username", user);
    setUsername(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("rc_admin_username");
    setUsername(null);
  }, []);

  const value = { username, isLoggedIn: Boolean(username), login, logout };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within an AdminProvider");
  return ctx;
}
