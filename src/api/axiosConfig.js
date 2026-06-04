// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15000,
//   headers: { 'Content-Type': 'application/json' },
// });

// // ─── Request Interceptor ───────────────────────────────────────────
// // Automatically attaches the access token to every request
// api.interceptors.request.use(
//   (config) => {
//     // Using the storage key defined in your AuthContext and API docs
//     const token = localStorage.getItem('sms_access_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ─── Response Interceptor ──────────────────────────────────────────
// // Handles token expiration (401) and attempts to refresh the token
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if error is 401 (Unauthorized) and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem('sms_refresh_token');
        
//         if (refreshToken) {
//           // Call the refresh-token endpoint
//           const res = await axios.post(
//             `${API_BASE_URL}/auth/refresh-token`,
//             { refresh_token: refreshToken } // Backend expects 'refresh_token' in body
//           );

//           const { access_token } = res.data;

//           if (access_token) {
//             // 1. Save the new access token
//             localStorage.setItem('sms_access_token', access_token);
            
//             // 2. Update the header for the original request
//             originalRequest.headers.Authorization = `Bearer ${access_token}`;
            
//             // 3. Retry the original request
//             return api(originalRequest);
//           }
//         }
//       } catch (refreshError) {
//         // Refresh failed - clear storage and force logout
//         console.error('Session refresh failed:', refreshError);
//         localStorage.removeItem('sms_access_token');
//         localStorage.removeItem('sms_refresh_token');
//         localStorage.removeItem('sms_user_role');
//         localStorage.removeItem('isSuperAdmin');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     // If not a 401 or refresh failed, reject with a formatted error message
//     const message =
//       error.response?.data?.error ||          // API error field
//       error.response?.data?.message ||        // Standard message field
//       error.message ||                        // Axios error message
//       'An unexpected error occurred';

//     return Promise.reject(new Error(message));
//   }
// );

// export default api;


// src/api/axiosConfig.js

import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const ACCESS_TOKEN_KEY = 'sms_access_token';
const REFRESH_TOKEN_KEY = 'sms_refresh_token';
const USER_ROLE_KEY = 'sms_user_role';
const SUPER_ADMIN_FLAG_KEY = 'isSuperAdmin';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(SUPER_ADMIN_FLAG_KEY);
};

const redirectToLogin = () => {
  if (window.location.hash !== '#/login') {
    window.location.hash = '/login';
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = originalRequest.url || '';
    const isRefreshRequest = requestUrl.includes('/auth/refresh-token');
    const isLoginRequest =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/super-admin/login');

    if (status === 401 && !originalRequest._retry && !isRefreshRequest && !isLoginRequest) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        clearAuthStorage();
        redirectToLogin();

        const noSessionError = new Error('Your session has expired. Please login again.');
        noSessionError.status = 401;
        return Promise.reject(noSessionError);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          })
          .catch((queueError) => Promise.reject(queueError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refresh_token: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const payload = res.data ?? {};
        const newAccessToken =
          payload.access_token || payload.data?.access_token || null;
        const newRefreshToken =
          payload.refresh_token || payload.data?.refresh_token || null;

        if (!newAccessToken) {
          throw new Error('No access token returned from refresh.');
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

        if (newRefreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthStorage();
        redirectToLogin();

        const refreshMessage =
          refreshError.response?.data?.message ||
          refreshError.response?.data?.error ||
          refreshError.message ||
          'Your session has expired. Please login again.';

        const formattedRefreshError = new Error(refreshMessage);
        formattedRefreshError.status = 401;

        return Promise.reject(formattedRefreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    const formattedError = new Error(message);
    formattedError.status = status;
    formattedError.data = error.response?.data;
    formattedError.originalError = error;

    return Promise.reject(formattedError);
  }
);

export default api;