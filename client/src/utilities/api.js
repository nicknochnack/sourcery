import axios from "axios";

const loc = window.location;
const baseURL = `${loc.protocol}//${loc.hostname}${
  loc.hostname === "localhost" ? ":8080/api" : "/api"
}`;

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  (config) => {
    if (!config.public) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
