import api from "./api"; // Make sure this points to your Axios instance

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
};

export const checkAuthStatus = async () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await api.get("/user/me");
    return !!response.data.user;
  } catch (error) {
    console.error("Error checking auth status:", error);
    logout();
    return false;
  }
};
