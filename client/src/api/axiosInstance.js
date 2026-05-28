import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  timeout: 15000, // 15 second timeout — prevents infinite loading
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

// Response error interceptor — converts network/timeout errors to readable messages
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      error.message = "Request timed out. The server took too long to respond.";
    } else if (!error.response) {
      // Network error — no response from server (CORS, offline, wrong URL)
      error.message =
        "Network error: Unable to reach the server. Please check your connection or try again later.";
    }
    return Promise.reject(error);
  }
);

export default API;
