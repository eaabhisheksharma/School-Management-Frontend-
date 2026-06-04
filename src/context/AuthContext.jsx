// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { 
//   login, 
//   logout, 
//   getCurrentUser, 
//   updateProfile, 
//   changePassword,
//   superAdminLogin as superAdminLoginApi 
// } from '../api/authApi';

// // 1. Create the Context
// const AuthContext = createContext(null);

// // 2. Define the Hook immediately (Named Export)
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used inside <AuthProvider>');
//   }
//   return context;
// };

// // 3. Define the Provider Component
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('sms_access_token');
//     if (!token) { setLoading(false); return; }
    
//     getCurrentUser()
//       .then(res => {
//         const userData = res.data?.data || res.data;
//         setUser(userData);
//       })
//       .catch(() => {
//         localStorage.removeItem('sms_access_token');
//         localStorage.removeItem('sms_refresh_token');
//         localStorage.removeItem('sms_user_role');
//         localStorage.removeItem('isSuperAdmin');
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const loginUser = useCallback(async (credentials) => {
//     setError(null);
//     try {
//       const res = await login(credentials);
//       const { access_token, refresh_token, user: userData } = res.data || res;
//       localStorage.setItem('sms_access_token', access_token);
//       if (refresh_token) localStorage.setItem('sms_refresh_token', refresh_token);
//       if (userData?.role) localStorage.setItem('sms_user_role', userData.role);
//       setUser(userData);
//       return userData;
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message || 'Login failed.';
//       setError(msg);
//       throw err;
//     }
//   }, []);

//   const superAdminLogin = useCallback(async (credentials) => {
//     setError(null);
//     try {
//       const res = await superAdminLoginApi(credentials);
//       const { access_token, refresh_token, user: userData, admin: adminData } = res.data || res;
//       const activeUser = adminData || userData;
//       localStorage.setItem('sms_access_token', access_token);
//       if (refresh_token) localStorage.setItem('sms_refresh_token', refresh_token);
//       localStorage.setItem('sms_user_role', 'superadmin');
//       localStorage.setItem('isSuperAdmin', 'true');
//       setUser({ ...activeUser, role: 'superadmin' });
//       return activeUser;
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message || 'Super Admin login failed.';
//       setError(msg);
//       throw err;
//     }
//   }, []);

//   const logoutUser = useCallback(async () => {
//     try { await logout(); } catch (_) {}
//     localStorage.removeItem('sms_access_token');
//     localStorage.removeItem('sms_refresh_token');
//     localStorage.removeItem('sms_user_role');
//     localStorage.removeItem('isSuperAdmin');
//     setUser(null);
//     setError(null);
//   }, []);

//   const updateUserProfile = useCallback(async (data) => {
//     const res = await updateProfile(data);
//     const updated = res.data?.data || res.data;
//     setUser(prev => ({ ...prev, ...updated }));
//     return updated;
//   }, []);

//   const changeUserPassword = useCallback(async (data) => {
//     const res = await changePassword(data);
//     return res.data;
//   }, []);

//   const clearError = useCallback(() => setError(null), []);

//   const userRole = user?.role || localStorage.getItem('sms_user_role') || 'guest';
//   const isSuperAdmin = userRole === 'superadmin' || localStorage.getItem('isSuperAdmin') === 'true';
//   const isPrincipal = userRole === 'principal';
//   const isTeacher = userRole === 'teacher';
//   const isStudent = userRole === 'student';
//   const isParent = userRole === 'parent';
//   const isAccountant = userRole === 'accountant';
//   const isAdmin = isPrincipal || isSuperAdmin;

//   const hasRole = useCallback((role) => isSuperAdmin || userRole === role, [userRole, isSuperAdmin]);
//   const hasPermission = useCallback((permission) => isSuperAdmin || isPrincipal || (user?.permissions?.includes(permission)), [user, isPrincipal, isSuperAdmin]);

//   const value = {
//     user, loading, authLoading: loading, error, isAuthenticated: !!user, 
//     sessionExpired: false, permissions: user?.permissions || [], lastActivity: null,
//     userRole, userName: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email, userAvatar: user?.avatar,
//     isSuperAdmin, isAdmin, isPrincipal, isTeacher, isStudent, isParent, isAccountant,
//     login: loginUser, loginUser, superAdminLogin, logout: logoutUser, logoutUser,
//     updateUserProfile, changeUserPassword, hasRole, hasPermission, clearError, dismissExpired: () => {},
//   };

//   if (loading) {
//     return (
//       <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#f8fafc', flexDirection:'column', gap:16 }}>
//         <div style={{ width:48, height:48, border:'4px solid #e2e8f0', borderTop:'4px solid #2563eb', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
//         <span style={{ color:'#64748b', fontSize:14 }}>Initializing...</span>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // 4. Default Export is the Provider
// export default AuthProvider;



// // Program Chnage 



// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { 
//   login, 
//   logout, 
//   getCurrentUser, 
//   updateProfile, 
//   changePassword,
//   superAdminLogin as superAdminLoginApi 
// } from '../api/authApi';

// // 1. Create Context
// const AuthContext = createContext(null);

// // 2. Create the Hook (Exported Named)
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used inside <AuthProvider>');
//   }
//   return context;
// };

// // 3. Create the Provider Component
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('sms_access_token');
//     if (!token) { setLoading(false); return; }
    
//     getCurrentUser()
//       .then(res => {
//         const userData = res.data?.data || res.data;
//         setUser(userData);
//       })
//       .catch(() => {
//         localStorage.removeItem('sms_access_token');
//         localStorage.removeItem('sms_refresh_token');
//         localStorage.removeItem('sms_user_role');
//         localStorage.removeItem('isSuperAdmin');
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const loginUser = useCallback(async (credentials) => {
//     setError(null);
//     try {
//       const res = await login(credentials);
//       const { access_token, refresh_token, user: userData } = res.data || res;
//       localStorage.setItem('sms_access_token', access_token);
//       if (refresh_token) localStorage.setItem('sms_refresh_token', refresh_token);
//       if (userData?.role) localStorage.setItem('sms_user_role', userData.role);
//       setUser(userData);
//       return userData;
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message || 'Login failed.';
//       setError(msg);
//       throw err;
//     }
//   }, []);

//   const superAdminLogin = useCallback(async (credentials) => {
//     setError(null);
//     try {
//       const res = await superAdminLoginApi(credentials);
//       const { access_token, refresh_token, user: userData, admin: adminData } = res.data || res;
//       const activeUser = adminData || userData;
//       localStorage.setItem('sms_access_token', access_token);
//       if (refresh_token) localStorage.setItem('sms_refresh_token', refresh_token);
//       localStorage.setItem('sms_user_role', 'superadmin');
//       localStorage.setItem('isSuperAdmin', 'true');
//       setUser({ ...activeUser, role: 'superadmin' });
//       return activeUser;
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message || 'Super Admin login failed.';
//       setError(msg);
//       throw err;
//     }
//   }, []);

//   const logoutUser = useCallback(async () => {
//     try { await logout(); } catch (_) {}
//     localStorage.removeItem('sms_access_token');
//     localStorage.removeItem('sms_refresh_token');
//     localStorage.removeItem('sms_user_role');
//     localStorage.removeItem('isSuperAdmin');
//     setUser(null);
//     setError(null);
//   }, []);

//   const updateUserProfile = useCallback(async (data) => {
//     const res = await updateProfile(data);
//     const updated = res.data?.data || res.data;
//     setUser(prev => ({ ...prev, ...updated }));
//     return updated;
//   }, []);

//   const changeUserPassword = useCallback(async (data) => {
//     const res = await changePassword(data);
//     return res.data;
//   }, []);

//   const clearError = useCallback(() => setError(null), []);

//   const userRole = user?.role || localStorage.getItem('sms_user_role') || 'guest';
//   const isSuperAdmin = userRole === 'superadmin' || localStorage.getItem('isSuperAdmin') === 'true';
//   const isPrincipal = userRole === 'principal';
//   const isTeacher = userRole === 'teacher';
//   const isStudent = userRole === 'student';
//   const isParent = userRole === 'parent';
//   const isAccountant = userRole === 'accountant';
//   const isAdmin = isPrincipal || isSuperAdmin;

//   const hasRole = useCallback((role) => isSuperAdmin || userRole === role, [userRole, isSuperAdmin]);
//   const hasPermission = useCallback((permission) => isSuperAdmin || isPrincipal || (user?.permissions?.includes(permission)), [user, isPrincipal, isSuperAdmin]);

//   const value = {
//     user, loading, authLoading: loading, error, isAuthenticated: !!user, 
//     sessionExpired: false, permissions: user?.permissions || [], lastActivity: null,
//     userRole, userName: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email, userAvatar: user?.avatar,
//     isSuperAdmin, isAdmin, isPrincipal, isTeacher, isStudent, isParent, isAccountant,
//     login: loginUser, loginUser, superAdminLogin, logout: logoutUser, logoutUser,
//     updateUserProfile, changeUserPassword, hasRole, hasPermission, clearError, dismissExpired: () => {},
//   };

//   if (loading) {
//     return (
//       <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#f8fafc', flexDirection:'column', gap:16 }}>
//         <div style={{ width:48, height:48, border:'4px solid #e2e8f0', borderTop:'4px solid #2563eb', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
//         <span style={{ color:'#64748b', fontSize:14 }}>Initializing...</span>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // 4. Export Provider as Default
// export default AuthProvider;





// // Code change 



// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { 
//   login, 
//   logout, 
//   getCurrentUser, 
//   updateProfile, 
//   changePassword,
//   superAdminLogin as superAdminLoginApi 
// } from '../api/authApi';

// // 1. Create Context
// const AuthContext = createContext(null);

// // 2. Create the Hook (Exported Named)
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used inside <AuthProvider>');
//   }
//   return context;
// };

// // 3. Create the Provider Component
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('sms_access_token');
//     if (!token) { setLoading(false); return; }
    
//     getCurrentUser()
//       .then(res => {
//         const userData = res.data?.data || res.data;
//         setUser(userData);
//       })
//       .catch(() => {
//         localStorage.removeItem('sms_access_token');
//         localStorage.removeItem('sms_refresh_token');
//         localStorage.removeItem('sms_user_role');
//         localStorage.removeItem('isSuperAdmin');
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const loginUser = useCallback(async (credentials) => {
//     setError(null);
//     try {
//       const res = await login(credentials);
//       // Standard login response
//       const { access_token, refresh_token, user: userData } = res.data || res;
      
//       localStorage.setItem('sms_access_token', access_token);
//       if (refresh_token) localStorage.setItem('sms_refresh_token', refresh_token);
//       if (userData?.role) localStorage.setItem('sms_user_role', userData.role);
      
//       setUser(userData);
//       return userData;
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message || 'Login failed.';
//       setError(msg);
//       throw err;
//     }
//   }, []);

//   const superAdminLogin = useCallback(async (credentials) => {
//     setError(null);
//     try {
//       const res = await superAdminLoginApi(credentials);
      
//       // UPDATED: Correctly handle your API structure: { success, access_token, user: {...} }
//       const { access_token, refresh_token, user: userData } = res.data || res;

//       localStorage.setItem('sms_access_token', access_token);
//       if (refresh_token) localStorage.setItem('sms_refresh_token', refresh_token);
      
//       // Store the role that comes from backend ('super_admin')
//       if (userData?.role) localStorage.setItem('sms_user_role', userData.role);
      
//       // Set a specific flag for easy checking
//       localStorage.setItem('isSuperAdmin', 'true');

//       setUser(userData);
//       return userData;
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message || 'Super Admin login failed.';
//       setError(msg);
//       throw err;
//     }
//   }, []);

//   const logoutUser = useCallback(async () => {
//     try { await logout(); } catch (_) {}
//     localStorage.removeItem('sms_access_token');
//     localStorage.removeItem('sms_refresh_token');
//     localStorage.removeItem('sms_user_role');
//     localStorage.removeItem('isSuperAdmin');
//     setUser(null);
//     setError(null);
//   }, []);

//   const updateUserProfile = useCallback(async (data) => {
//     const res = await updateProfile(data);
//     const updated = res.data?.data || res.data;
//     setUser(prev => ({ ...prev, ...updated }));
//     return updated;
//   }, []);

//   const changeUserPassword = useCallback(async (data) => {
//     const res = await changePassword(data);
//     return res.data;
//   }, []);

//   const clearError = useCallback(() => setError(null), []);

//   // Derive role from user object or local storage
//   const userRole = user?.role || localStorage.getItem('sms_user_role') || 'guest';
  
//   // UPDATED: Check for 'super_admin' (backend) OR 'superadmin' (fallback)
//   const isSuperAdmin = userRole === 'super_admin' || userRole === 'superadmin' || localStorage.getItem('isSuperAdmin') === 'true';

//   // Role Booleans
//   const isPrincipal = userRole === 'principal';
//   const isTeacher = userRole === 'teacher';
//   const isStudent = userRole === 'student';
//   const isParent = userRole === 'parent';
//   const isAccountant = userRole === 'accountant';
//   const isAdmin = isPrincipal || isSuperAdmin;

//   const hasRole = useCallback((role) => isSuperAdmin || userRole === role, [userRole, isSuperAdmin]);
//   const hasPermission = useCallback((permission) => isSuperAdmin || isPrincipal || (user?.permissions?.includes(permission)), [user, isPrincipal, isSuperAdmin]);

//   const value = {
//     user, loading, authLoading: loading, error, isAuthenticated: !!user, 
//     sessionExpired: false, permissions: user?.permissions || [], lastActivity: null,
//     userRole, userName: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email, userAvatar: user?.avatar,
//     isSuperAdmin, isAdmin, isPrincipal, isTeacher, isStudent, isParent, isAccountant,
//     login: loginUser, loginUser, superAdminLogin, logout: logoutUser, logoutUser,
//     updateUserProfile, changeUserPassword, hasRole, hasPermission, clearError, dismissExpired: () => {},
//   };

//   if (loading) {
//     return (
//       <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#f8fafc', flexDirection:'column', gap:16 }}>
//         <div style={{ width:48, height:48, border:'4px solid #e2e8f0', borderTop:'4px solid #2563eb', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
//         <span style={{ color:'#64748b', fontSize:14 }}>Initializing...</span>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // 4. Export Provider as Default
// export default AuthProvider;


// // Code Change


// // src/context/AuthContext.jsx

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { 
//   login, 
//   logout, 
//   getCurrentUser, 
//   updateProfile, 
//   changePassword,
//   superAdminLogin as superAdminLoginApi 
// } from '../api/authApi';

// // 1. Create Context
// const AuthContext = createContext(null);

// // 2. Create the Hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used inside <AuthProvider>');
//   }
//   return context;
// };

// // 3. Create the Provider Component
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // --- FIX: Robust initialization to handle nested 'data' object ---
//   useEffect(() => {
//     const token = localStorage.getItem('sms_access_token');
//     if (!token) { 
//       setLoading(false); 
//       return; 
//     }
    
//     getCurrentUser()
//       .then(res => {
//         // Backend response structure is usually: { success: true, data: { user_id: '...', role: '...' } }
//         const userData = res.data?.data || res.data;
        
//         // Double check we actually have a user_id before setting user
//         if (userData && userData.user_id) {
//           setUser(userData);
          
//           // Ensure local storage is synced with the latest role from DB
//           if (userData.role) {
//             localStorage.setItem('sms_user_role', userData.role);
//           }
//         } else {
//           // If response is empty or invalid, clear token to stop loop
//           console.error("Invalid user data received, clearing token");
//           localStorage.removeItem('sms_access_token');
//           setUser(null);
//         }
//       })
//       .catch((err) => {
//         console.error("Session fetch failed:", err);
//         localStorage.removeItem('sms_access_token');
//         localStorage.removeItem('sms_refresh_token');
//         localStorage.removeItem('sms_user_role');
//         localStorage.removeItem('isSuperAdmin');
//         setUser(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const loginUser = useCallback(async (credentials) => {
//     setError(null);
//     try {
//       const res = await login(credentials);
//       // Standard login response
//       const { access_token, refresh_token, user: userData } = res.data || res;
      
//       localStorage.setItem('sms_access_token', access_token);
//       if (refresh_token) localStorage.setItem('sms_refresh_token', refresh_token);
//       if (userData?.role) localStorage.setItem('sms_user_role', userData.role);
      
//       setUser(userData);
//       return userData;
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message || 'Login failed.';
//       setError(msg);
//       throw err;
//     }
//   }, []);

//   const superAdminLogin = useCallback(async (credentials) => {
//     setError(null);
//     try {
//       const res = await superAdminLoginApi(credentials);
      
//       // API returns: { success, access_token, refresh_token, user: {...} }
//       const { access_token, refresh_token, user: userData } = res.data || res;

//       if (!access_token) throw new Error("No access token returned");

//       localStorage.setItem('sms_access_token', access_token);
//       if (refresh_token) localStorage.setItem('sms_refresh_token', refresh_token);
      
//       // Store role flags
//       if (userData?.role) localStorage.setItem('sms_user_role', userData.role);
//       localStorage.setItem('isSuperAdmin', 'true');

//       setUser(userData);
//       return userData;
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message || 'Super Admin login failed.';
//       setError(msg);
//       throw err;
//     }
//   }, []);

//   const logoutUser = useCallback(async () => {
//     try { await logout(); } catch (_) {}
//     localStorage.removeItem('sms_access_token');
//     localStorage.removeItem('sms_refresh_token');
//     localStorage.removeItem('sms_user_role');
//     localStorage.removeItem('isSuperAdmin');
//     setUser(null);
//     setError(null);
//   }, []);

//   const updateUserProfile = useCallback(async (data) => {
//     const res = await updateProfile(data);
//     const updated = res.data?.data || res.data;
//     setUser(prev => ({ ...prev, ...updated }));
//     return updated;
//   }, []);

//   const changeUserPassword = useCallback(async (data) => {
//     const res = await changePassword(data);
//     return res.data;
//   }, []);

//   const clearError = useCallback(() => setError(null), []);

//   // Derive role from user object or local storage
//   const userRole = user?.role || localStorage.getItem('sms_user_role') || 'guest';
  
//   // Check for 'super_admin' (backend) OR 'superadmin'
//   const isSuperAdmin = userRole === 'super_admin' || userRole === 'superadmin' || localStorage.getItem('isSuperAdmin') === 'true';

//   // Role Booleans
//   const isPrincipal = userRole === 'principal';
//   const isTeacher = userRole === 'teacher';
//   const isStudent = userRole === 'student';
//   const isParent = userRole === 'parent';
//   const isAccountant = userRole === 'accountant';
//   const isAdmin = isPrincipal || isSuperAdmin;

//   const hasRole = useCallback((role) => isSuperAdmin || userRole === role, [userRole, isSuperAdmin]);
//   const hasPermission = useCallback((permission) => isSuperAdmin || isPrincipal || (user?.permissions?.includes(permission)), [user, isPrincipal, isSuperAdmin]);

//   const value = {
//     user, loading, authLoading: loading, error, isAuthenticated: !!user, 
//     sessionExpired: false, permissions: user?.permissions || [], lastActivity: null,
//     userRole, userName: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email, userAvatar: user?.avatar,
//     isSuperAdmin, isAdmin, isPrincipal, isTeacher, isStudent, isParent, isAccountant,
//     login: loginUser, loginUser, superAdminLogin, logout: logoutUser, logoutUser,
//     updateUserProfile, changeUserPassword, hasRole, hasPermission, clearError, dismissExpired: () => {},
//   };

//   if (loading) {
//     return (
//       <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#f8fafc', flexDirection:'column', gap:16 }}>
//         <div style={{ width:48, height:48, border:'4px solid #e2e8f0', borderTop:'4px solid #2563eb', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
//         <span style={{ color:'#64748b', fontSize:14 }}>Initializing...</span>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;


// src/context/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  superAdminLogin as superAdminLoginApi,
} from '../api/authApi';

export const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = 'sms_access_token';
const REFRESH_TOKEN_KEY = 'sms_refresh_token';
const USER_ROLE_KEY = 'sms_user_role';
const SUPER_ADMIN_FLAG_KEY = 'isSuperAdmin';

const normalizeRole = (role) => {
  if (!role) return 'guest';
  if (role === 'superadmin') return 'super_admin';
  return role;
};

const extractUserFromResponse = (response) => {
  const payload = response?.data ?? response;

  return (
    payload?.data?.user ||
    payload?.user ||
    payload?.data ||
    payload ||
    null
  );
};

const extractTokensFromResponse = (response) => {
  const payload = response?.data ?? response;

  return {
    accessToken:
      payload?.access_token ||
      payload?.data?.access_token ||
      payload?.token ||
      null,
    refreshToken:
      payload?.refresh_token ||
      payload?.data?.refresh_token ||
      null,
  };
};

const clearStoredAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(SUPER_ADMIN_FLAG_KEY);
};

const storeAuthData = ({ accessToken, refreshToken, userData }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  const normalizedRole = normalizeRole(userData?.role);
  if (normalizedRole && normalizedRole !== 'guest') {
    localStorage.setItem(USER_ROLE_KEY, normalizedRole);
  }

  if (normalizedRole === 'super_admin') {
    localStorage.setItem(SUPER_ADMIN_FLAG_KEY, 'true');
  } else {
    localStorage.removeItem(SUPER_ADMIN_FLAG_KEY);
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((res) => {
        const userData = extractUserFromResponse(res);

        if (userData && (userData.user_id || userData.id || userData.email)) {
          const normalizedUser = {
            ...userData,
            role: normalizeRole(userData.role),
            permissions: Array.isArray(userData.permissions) ? userData.permissions : [],
          };

          setUser(normalizedUser);

          if (normalizedUser.role && normalizedUser.role !== 'guest') {
            localStorage.setItem(USER_ROLE_KEY, normalizedUser.role);
          }

          if (normalizedUser.role === 'super_admin') {
            localStorage.setItem(SUPER_ADMIN_FLAG_KEY, 'true');
          } else {
            localStorage.removeItem(SUPER_ADMIN_FLAG_KEY);
          }
        } else {
          console.error('Invalid user data received, clearing token');
          clearStoredAuth();
          setUser(null);
        }
      })
      .catch((err) => {
        console.error('Session fetch failed:', err);
        clearStoredAuth();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginUser = useCallback(async (credentials) => {
    setError(null);

    try {
      const res = await login(credentials);
      const userDataRaw = extractUserFromResponse(res);
      const { accessToken, refreshToken } = extractTokensFromResponse(res);

      const userData = userDataRaw
        ? {
            ...userDataRaw,
            role: normalizeRole(userDataRaw.role),
            permissions: Array.isArray(userDataRaw.permissions) ? userDataRaw.permissions : [],
          }
        : null;

      if (!accessToken) {
        throw new Error('No access token returned');
      }

      storeAuthData({ accessToken, refreshToken, userData });
      setUser(userData);

      return userData;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed.';
      setError(msg);
      throw err;
    }
  }, []);

  const superAdminLogin = useCallback(async (credentials) => {
    setError(null);

    try {
      const res = await superAdminLoginApi(credentials);
      const userDataRaw = extractUserFromResponse(res);
      const { accessToken, refreshToken } = extractTokensFromResponse(res);

      if (!accessToken) {
        throw new Error('No access token returned');
      }

      const userData = {
        ...(userDataRaw || {}),
        role: 'super_admin',
        permissions: Array.isArray(userDataRaw?.permissions) ? userDataRaw.permissions : [],
      };

      storeAuthData({ accessToken, refreshToken, userData });
      setUser(userData);

      return userData;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Super Admin login failed.';
      setError(msg);
      throw err;
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } catch (_) {}

    clearStoredAuth();
    setUser(null);
    setError(null);
  }, []);

  const updateUserProfile = useCallback(async (data) => {
    const res = await updateProfile(data);
    const updatedRaw = extractUserFromResponse(res);

    const updated = {
      ...(updatedRaw || {}),
      role: normalizeRole(updatedRaw?.role || user?.role),
      permissions: Array.isArray(updatedRaw?.permissions)
        ? updatedRaw.permissions
        : Array.isArray(user?.permissions)
        ? user.permissions
        : [],
    };

    setUser((prev) => ({ ...prev, ...updated }));

    if (updated.role && updated.role !== 'guest') {
      localStorage.setItem(USER_ROLE_KEY, updated.role);
    }

    if (updated.role === 'super_admin') {
      localStorage.setItem(SUPER_ADMIN_FLAG_KEY, 'true');
    } else {
      localStorage.removeItem(SUPER_ADMIN_FLAG_KEY);
    }

    return updated;
  }, [user]);

  const changeUserPassword = useCallback(async (data) => {
    const res = await changePassword(data);
    return res.data ?? res;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const userRole = normalizeRole(user?.role || localStorage.getItem(USER_ROLE_KEY));
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const isSuperAdmin =
    userRole === 'super_admin' || localStorage.getItem(SUPER_ADMIN_FLAG_KEY) === 'true';

  const isPrincipal = userRole === 'principal';
  const isTeacher = userRole === 'teacher';
  const isStudent = userRole === 'student';
  const isParent = userRole === 'parent';
  const isAccountant = userRole === 'accountant';
  const isAdmin = isPrincipal || isSuperAdmin;

  const hasRole = useCallback(
    (role) => {
      const normalizedRequestedRole = normalizeRole(role);
      return isSuperAdmin || userRole === normalizedRequestedRole;
    },
    [userRole, isSuperAdmin]
  );

  const hasPermission = useCallback(
    (permission) => {
      return isSuperAdmin || isPrincipal || permissions.includes(permission);
    },
    [permissions, isPrincipal, isSuperAdmin]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      authLoading: loading,
      error,
      isAuthenticated: !!user,
      sessionExpired: false,
      permissions,
      lastActivity: null,
      userRole,
      userName: user?.first_name
        ? `${user.first_name} ${user.last_name || ''}`.trim()
        : user?.name || user?.email || 'User',
      userAvatar: user?.avatar || null,
      isSuperAdmin,
      isAdmin,
      isPrincipal,
      isTeacher,
      isStudent,
      isParent,
      isAccountant,
      login: loginUser,
      loginUser,
      superAdminLogin,
      logout: logoutUser,
      logoutUser,
      updateUserProfile,
      changeUserPassword,
      hasRole,
      hasPermission,
      clearError,
      dismissExpired: () => {},
    }),
    [
      user,
      loading,
      error,
      permissions,
      userRole,
      isSuperAdmin,
      isAdmin,
      isPrincipal,
      isTeacher,
      isStudent,
      isParent,
      isAccountant,
      loginUser,
      superAdminLogin,
      logoutUser,
      updateUserProfile,
      changeUserPassword,
      hasRole,
      hasPermission,
      clearError,
    ]
  );

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#f8fafc',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ color: '#64748b', fontSize: 14 }}>Initializing...</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;