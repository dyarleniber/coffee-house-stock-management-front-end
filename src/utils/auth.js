import { MANAGER_ROLE } from "../constants/role";
import api from "../services/api";

export const isAuthenticated = (cookies) => {
  const { user: rawUser, token } = cookies;
  const user = typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
  if (!user || !token) {
    return false;
  }
  api.defaults.headers.authorization = `Bearer ${token}`;
  return user;
};

export const isAuthenticatedByManager = (cookies) => {
  const user = isAuthenticated(cookies);
  if (!user) {
    return false;
  }
  return user.roleId == MANAGER_ROLE;
};
