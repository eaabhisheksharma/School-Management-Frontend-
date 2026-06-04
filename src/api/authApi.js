import api from './axiosConfig';

/**
 * Auth API
 * Handles authentication, registration, and account management.
 * Base URL: /api/auth
 */

/* ── Public Auth Routes ──────────────────────────────────── */

// POST /auth/login
// Used by all users (Super Admin, Principal, Teacher, Student)
export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

// POST /auth/register-super-admin
// One-time setup for creating the platform super admin
export const registerSuperAdmin = async (data) => {
  const res = await api.post('/auth/register-super-admin', data);
  return res.data;
};

// POST /auth/register-school
// Protected: Super Admin only. Creates a new school and principal.
export const registerSchool = async (data) => {
  const res = await api.post('/auth/register-school', data);
  return res.data;
};

// POST /auth/forgot-password
export const forgotPassword = async (data) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};

// POST /auth/reset-password/:token
// Note: The token is usually passed in the URL or body. 
// If your router expects :token, you may need to append it to the URL.
export const resetPassword = async (token, data) => {
  const res = await api.post(`/auth/reset-password/${token}`, data);
  return res.data;
};

// POST /auth/refresh-token
export const refreshToken = async (data) => {
  const res = await api.post('/auth/refresh-token', data);
  return res.data;
};

/* ── Protected User Routes ───────────────────────────────── */

// POST /auth/logout
// Requires Bearer Token
export const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

// GET /auth/me
// Fetches the currently authenticated user's profile
export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

// PUT /auth/change-password
// Requires current_password, new_password, confirm_password
export const changePassword = async (data) => {
  const res = await api.put('/auth/change-password', data);
  return res.data;
};

/* ── Aliases for Backward Compatibility ─────────────────── */

export const loginUser = login;
export const logoutUser = logout;
export const updateProfile = async (data) => {
  // If you have a specific profile update endpoint, use it here.
  // Otherwise, assuming 'me' or a profile endpoint exists.
  // For now, keeping it safe if you have a separate route.
  const res = await api.put('/auth/profile', data); 
  return res.data;
};

/* ── Super Admin Specific ────────────────────────────────── */

// Specific function for Super Admin Login if needed explicitly
export const superAdminLogin = async (credentials) => {
  // Uses the same /login endpoint but ensures semantic clarity
  return login(credentials); 
};

/* ── Verification (Optional based on backend implementation) ── */

export const verifyEmail = async (data) => {
  const res = await api.post('/auth/verify-email', data);
  return res.data;
};

export const resendVerification = async (data) => {
  const res = await api.post('/auth/resend-verification', data);
  return res.data;
};