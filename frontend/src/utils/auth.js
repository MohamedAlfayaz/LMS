import { jwtDecode } from "jwt-decode";

export const getDecodedToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenValid = () => {
  const decoded = getDecodedToken();
  if (!decoded) return false;

  return decoded.exp * 1000 > Date.now();
};

export const getUserRole = () => {
  const decoded = getDecodedToken();
  return decoded?.role || null;
};