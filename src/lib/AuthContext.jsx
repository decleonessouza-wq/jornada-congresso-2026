import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
  }, []);

  const value = useMemo(
    () => ({
      user: null,
      isAuthenticated: false,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      authChecked,
      appPublicSettings: {
        auth_required: false,
        name: "Jornada Congresso 2026",
      },
      logout: () => {
        window.location.href = "/";
      },
      navigateToLogin: () => {
        window.location.href = "/";
      },
      checkUserAuth: async () => null,
      checkAppState: async () => null,
    }),
    [authChecked]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  }

  return context;
}