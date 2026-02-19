import axios from "axios";

/*
  AXIOS INSTANCE FOR SLOTIFY BACKEND

  This instance is used for ALL API calls in the application.
  Responsibilities:
  • Set base URL for backend
  • Automatically attach JWT access token
  • Skip attaching token for login and register
  • Central place for future refresh token logic
*/

const axiosInstance = axios.create({

  // Base URL of Django backend API
  baseURL: "http://127.0.0.1:8000/api",

  // Default headers
  headers: {
    "Content-Type": "application/json",
  },

});


/*
  REQUEST INTERCEPTOR

  Runs BEFORE every API request.

  Purpose:
  • Attach Authorization header automatically
  • Skip auth endpoints (login/register)
  • Prevents manual token handling in every API file
*/

axiosInstance.interceptors.request.use(

  (config) => {

    // Get token stored during login
    const token = localStorage.getItem("access");


    /*
      EXCLUDE AUTH ENDPOINTS

      These endpoints must NOT include token:
      • login
      • register
      

      Otherwise login/register may break
    */

    const isAuthEndpoint =

      config.url.includes("/auth/login") ||
      config.url.includes("/auth/register");


    // Attach token if exists and not auth endpoint
    if (token && !isAuthEndpoint) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },


  (error) => {

    return Promise.reject(error);

  }

);


/*
  FUTURE USE:

  This instance will be used by:

  • workspaceApi.js
  • authApi.js
  • bookingApi.js
  • slotApi.js
  • professionalApi.js

  Ensures clean and scalable architecture
*/

export default axiosInstance;
