import axios from "axios";

/*
  SLOTIFY AXIOS INSTANCE

  Responsibilities
  • Central HTTP client
  • Automatically attach JWT
  • Skip auth endpoints safely
  • Handle expired sessions
*/

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});


/*
  ================= REQUEST INTERCEPTOR =================
*/

axiosInstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("access");

    const url = (config.url || "").toLowerCase();

    /*
      AUTH ENDPOINTS
      These should NEVER attach token
    */

    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/google") ||
      url.includes("/token") ||
      url.includes("/login") ||
      url.includes("/register");

    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);


/*
  ================= RESPONSE INTERCEPTOR =================
*/

axiosInstance.interceptors.response.use(

  (response) => response,

  (error) => {

    const status = error.response?.status;

    /*
      Token expired or invalid
    */

    if (status === 401) {

      console.warn("Session expired. Logging out.");

      localStorage.removeItem("access");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;