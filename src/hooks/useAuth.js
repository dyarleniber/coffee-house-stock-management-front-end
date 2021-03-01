import React, { createContext, useCallback, useState, useContext } from "react";
import Cookies from "js-cookie";
import api from "../services/api";
import { isAuthenticatedByManager } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user };
    }

    return {};
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post("/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    Cookies.set("token", token);
    Cookies.set("user", user);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("user");

    setData({});
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        isManager: isAuthenticatedByManager(data),
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
