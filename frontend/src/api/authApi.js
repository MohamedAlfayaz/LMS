import API from './api'

export const loginUser = async (data) => {
  const res = await API.post('/auth/login', data)
  return res.data;
}

export const registerUser = async (data) => {
  const res = await API.post('/auth/register', data)
  return res.data
}

export const forgotPassword = async (data) => {
  const res = await API.post("/auth/forgot-password", data);
  return res.data; // ✅ THIS LINE IS MISSING
};

export const resetPassword = async ({ token, password }) => {
  const res = await API.post(`/auth/reset-password/${token}`, { password });
  return res.data;
};