import React, { createContext, useContext } from "react";
import { useAuth } from "@clerk/clerk-expo";

interface AuthContextValue {
  userId: string | null | undefined;
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded, isSignedIn, getToken, signOut } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        userId,
        isLoaded,
        isSignedIn,
        getToken: () => getToken(),
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside AuthProvider");
  return ctx;
}
