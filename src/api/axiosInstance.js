import axios from "axios";

/*
  AXIOS INSTANCE FOR SLOTIFY BACKEND

  Responsibilities:
  • Central HTTP client
  • Attach JWT automatically
  • Skip auth endpoints safely
  • Provide strong debugging visibility
  • Prevent silent auth failures
*/

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
  ================= REQUEST INTERCEPTOR =================

  Runs before EVERY request.

  What it does:
  • Reads access token from localStorage
  • Skips auth endpoints safely
  • Attaches Bearer token when available
  • Adds debug visibility
*/

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    // Normalize URL safely
    const url = (config.url || "").toLowerCase();

    /*
      AUTH ENDPOINT DETECTION

      Keep this flexible — do NOT hardcode only one path.
      This prevents future breakage.
    */
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/login") ||
      url.includes("/register") ||
      url.includes("/token");

    // Ensure headers object exists
    config.headers = config.headers || {};

    /*
      Attach token when appropriate
    */
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /*
      Helpful debug (safe to keep in dev)

      Comment this in production if noisy.
    */
    // console.log("API Request:", config.method, config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

/*
  ================= RESPONSE INTERCEPTOR (OPTIONAL BUT STRONG) =================

  Helps detect expired tokens early.
  Not required but highly recommended.
*/

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, you may later trigger logout here
    if (error.response?.status === 401) {
      console.warn("Unauthorized request — token may be expired.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;