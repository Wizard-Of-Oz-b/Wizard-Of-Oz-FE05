import React, { createContext, useContext, useState, useMemo } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user;
  const value = useMemo(() => ({ user, isLoggedIn, setUser }), [user, isLoggedIn]);

  return React.createElement(AuthContext.Provider, { value }, children);
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 <AuthProvider> 내부에서만 사용해야 합니다.");
  return ctx;
};
