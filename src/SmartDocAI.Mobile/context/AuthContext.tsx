import React, { createContext, useState, useEffect, ReactNode } from "react";
import { saveToken, getToken, deleteToken } from "../utils/storage";
import { login as apiLogin, register as apiRegister } from "../api/authApi";

type User = { name: string; password: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredToken() {
      const storedToken = await getToken("authtoken");
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    }
    loadStoredToken();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Calling API login in AuthAPI");
    const data = await apiLogin(email, password);
    console.log(`token:${data.token}`);
    setUser(data.user);
    setToken(data.token);
    await saveToken("authtoken", data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiRegister(name, email, password);
    setUser(data.user);
    setToken(data.token);
    await saveToken("authtoken", data.token);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await deleteToken("authtoken");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
