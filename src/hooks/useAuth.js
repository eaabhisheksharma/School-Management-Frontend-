// //src/hooks/useAuth.js
// import { useContext, useCallback, useMemo } from 'react';
// import AuthContext from '../context/AuthContext';

// /**
//  * useAuth — primary auth hook
//  * Re-Exports everything from AuthContext with additional
//  * derived helpers so components never import context directly.
//  */
// const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');

//   const {
//     user,
//     token,
//     loading,
//     authLoading,
//     error,
//     isAuthenticated,
//     sessionExpired,
//     permissions,
//     lastActivity,
//     userRole,
//     userName,
//     userAvatar,
//     isAdmin,
//     isPrincipal,
//     isTeacher,
//     isStudent,
//     isParent,
//     isAccountant,
//     isSuperAdmin, // Destructure from Context
//     login,
//     superAdminLogin, // Destructure from Context
//     logout,
//     updateUserProfile,
//     changeUserPassword,
//     hasPermission,
//     hasRole,
//     clearError,
//     dismissExpired,
//   } = ctx;

//   /* ─── derived role flags ──────────────────────────────── */
//   const isStaff    = useMemo(() => isPrincipal || isTeacher,                    [isPrincipal, isTeacher]);
  
//   // Updated: Only Principals (or Super Admins) can manage
//   const canManage  = useMemo(() => isPrincipal || isSuperAdmin,                 [isPrincipal, isSuperAdmin]);
  
//   const canView    = useMemo(() => isAuthenticated,                             [isAuthenticated]);

//   /* ─── quick permission bundles ────────────────────────── */
//   const can = useMemo(() => ({
//     viewStudents    : hasPermission('view_students'),
//     manageStudents  : hasPermission('manage_students'),
//     viewTeachers    : hasPermission('view_teachers'),
//     manageTeachers  : hasPermission('manage_teachers'),
//     viewFees        : hasPermission('view_fees'),
//     manageFees      : hasPermission('manage_fees'),
//     viewExams       : hasPermission('view_exams'),
//     manageExams     : hasPermission('manage_exams'),
//     viewNotices     : hasPermission('view_notices'),
//     manageNotices   : hasPermission('manage_notices'),
//     viewReports     : hasPermission('view_reports'),
//     manageReports   : hasPermission('manage_reports'),
//     viewTimetable   : hasPermission('view_timetable'),
//     manageTimetable : hasPermission('manage_timetable'),
//     viewAttendance  : hasPermission('view_attendance'),
//     manageAttendance: hasPermission('manage_attendance'),
//     manageUsers     : hasPermission('manage_users'),
//     manageSettings  : hasPermission('manage_settings'),
    
//     // Super Admin specific permission bundle
//     manageSchools   : isSuperAdmin || hasPermission('manage_schools'),
//     systemSettings  : isSuperAdmin || hasPermission('system_settings'),
//   }), [hasPermission, isSuperAdmin]);

//   /* ─── user initials for avatar fallback ──────────────── */
//   const userInitials = useMemo(() => {
//     if (!userName) return 'U';
//     return userName
//       .split(' ')
//       .map((w) => w[0])
//       .slice(0, 2)
//       .join('')
//       .toUpperCase();
//   }, [userName]);

//   /* ─── role label ──────────────────────────────────────── */
//   const roleLabel = useMemo(() => {
//     const map = {
//       principal  : '🏫 Principal',
//       teacher    : '👨‍🏫 Teacher',
//       student    : '🎒 Student',
//       parent     : '👨‍👩‍👧 Parent',
//       accountant : '💰 Accountant',
//       superadmin : '🛡️ Super Admin',
//     };
//     return map[userRole] || userRole;
//   }, [userRole]);

//   /* ─── role colour for badges ──────────────────────────── */
//   const roleColor = useMemo(() => {
//     const map = {
//       principal  : { bg: '#fef9c3', color: '#854d0e' },
//       teacher    : { bg: '#eff6ff', color: '#1d4ed8' },
//       student    : { bg: '#f0fdf4', color: '#166534' },
//       parent     : { bg: '#f5f3ff', color: '#5b21b6' },
//       accountant : { bg: '#fff7ed', color: '#9a3412' },
//       superadmin : { bg: '#fff1f2', color: '#be123c' },
//     };
//     return map[userRole] || { bg: '#f1f5f9', color: '#475569' };
//   }, [userRole]);

//   /* ─── safe logout with optional redirect ─────────────── */
//   const logoutAndRedirect = useCallback(async (redirectTo = '/login') => {
//     await logout();
//     window.location.href = redirectTo;
//   }, [logout]);

//   /* ─── guard helper: throws if not authenticated ───────── */
//   const requireAuth = useCallback(() => {
//     if (!isAuthenticated) {
//       window.location.href = '/login';
//       throw new Error('Not authenticated');
//     }
//   }, [isAuthenticated]);

//   return {
//     /* raw context pass-through */
//     user,
//     token,
//     loading,
//     authLoading,
//     error,
//     isAuthenticated,
//     sessionExpired,
//     permissions,
//     lastActivity,

//     /* role booleans */
//     userRole,
//     userName,
//     userAvatar,
//     isAdmin,
//     isPrincipal,
//     isTeacher,
//     isStudent,
//     isParent,
//     isAccountant,
//     isSuperAdmin,
//     isStaff,
//     canManage,
//     canView,

//     /* derived */
//     userInitials,
//     roleLabel,
//     roleColor,
//     can,

//     /* actions */
//     login,
//     superAdminLogin,
//     logout,
//     logoutAndRedirect,
//     requireAuth,
//     updateUserProfile,
//     changeUserPassword,
//     hasPermission,
//     hasRole,
//     clearError,
//     dismissExpired,
//   };
// };

// // FIX: Changed back to Default Export to match all your existing page imports
// export default useAuth;


// src/hooks/useAuth.js
import { useContext, useCallback, useMemo } from 'react';
import {AuthContext} from '../context/AuthContext';

/**
 * useAuth — primary auth hook
 * Re-Exports everything from AuthContext with additional
 * derived helpers so components never import context directly.
 */
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');

  const {
    user,
    token,
    loading,
    authLoading,
    error,
    isAuthenticated,
    sessionExpired,
    permissions,
    lastActivity,
    userRole,
    userName,
    userAvatar,
    isAdmin,
    isPrincipal,
    isTeacher,
    isStudent,
    isParent,
    isAccountant,
    isSuperAdmin,
    login,
    superAdminLogin,
    logout,
    updateUserProfile,
    changeUserPassword,
    hasPermission,
    hasRole,
    clearError,
    dismissExpired,
  } = ctx;

  /* ─── derived role flags ──────────────────────────────── */
  const isStaff = useMemo(() => isPrincipal || isTeacher, [isPrincipal, isTeacher]);
  
  // Updated: Only Principals (or Super Admins) can manage
  const canManage = useMemo(() => isPrincipal || isSuperAdmin, [isPrincipal, isSuperAdmin]);
  
  const canView = useMemo(() => isAuthenticated, [isAuthenticated]);

  /* ─── quick permission bundles ────────────────────────── */
  const can = useMemo(() => ({
    viewStudents    : hasPermission('view_students'),
    manageStudents  : hasPermission('manage_students'),
    viewTeachers    : hasPermission('view_teachers'),
    manageTeachers  : hasPermission('manage_teachers'),
    viewFees        : hasPermission('view_fees'),
    manageFees      : hasPermission('manage_fees'),
    viewExams       : hasPermission('view_exams'),
    manageExams     : hasPermission('manage_exams'),
    viewNotices     : hasPermission('view_notices'),
    manageNotices   : hasPermission('manage_notices'),
    viewReports     : hasPermission('view_reports'),
    manageReports   : hasPermission('manage_reports'),
    viewTimetable   : hasPermission('view_timetable'),
    manageTimetable : hasPermission('manage_timetable'),
    viewAttendance  : hasPermission('view_attendance'),
    manageAttendance: hasPermission('manage_attendance'),
    manageUsers     : hasPermission('manage_users'),
    manageSettings  : hasPermission('manage_settings'),
    
    // Super Admin specific permission bundle
    manageSchools   : isSuperAdmin || hasPermission('manage_schools'),
    systemSettings  : isSuperAdmin || hasPermission('system_settings'),
  }), [hasPermission, isSuperAdmin]);

  /* ─── user initials for avatar fallback ──────────────── */
  const userInitials = useMemo(() => {
    if (!userName) return 'U';
    return userName
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [userName]);

  /* ─── role label ──────────────────────────────────────── */
  const roleLabel = useMemo(() => {
    const map = {
      principal  : '🏫 Principal',
      teacher    : '👨‍🏫 Teacher',
      student    : '🎒 Student',
      parent     : '👨‍👩‍👧 Parent',
      accountant : '💰 Accountant',
      super_admin: '🛡️ Super Admin', // FIXED: changed from superadmin to super_admin
    };
    return map[userRole] || userRole;
  }, [userRole]);

  /* ─── role colour for badges ──────────────────────────── */
  const roleColor = useMemo(() => {
    const map = {
      principal  : { bg: '#fef9c3', color: '#854d0e' },
      teacher    : { bg: '#eff6ff', color: '#1d4ed8' },
      student    : { bg: '#f0fdf4', color: '#166534' },
      parent     : { bg: '#f5f3ff', color: '#5b21b6' },
      accountant : { bg: '#fff7ed', color: '#9a3412' },
      super_admin: { bg: '#fff1f2', color: '#be123c' }, // FIXED: changed from superadmin to super_admin
    };
    return map[userRole] || { bg: '#f1f5f9', color: '#475569' };
  }, [userRole]);

  /* ─── safe logout with optional redirect ─────────────── */
  const logoutAndRedirect = useCallback(async (redirectTo = '/login') => {
    await logout();
    window.location.href = redirectTo;
  }, [logout]);

  /* ─── guard helper: throws if not authenticated ───────── */
  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      throw new Error('Not authenticated');
    }
  }, [isAuthenticated]);

  return {
    /* raw context pass-through */
    user,
    token,
    loading,
    authLoading,
    error,
    isAuthenticated,
    sessionExpired,
    permissions,
    lastActivity,

    /* role booleans */
    userRole,
    userName,
    userAvatar,
    isAdmin,
    isPrincipal,
    isTeacher,
    isStudent,
    isParent,
    isAccountant,
    isSuperAdmin,
    isStaff,
    canManage,
    canView,

    /* derived */
    userInitials,
    roleLabel,
    roleColor,
    can,

    /* actions */
    login,
    loginUser: login,
    superAdminLogin,
    logout,
    logoutUser: logout,
    logoutAndRedirect,
    requireAuth,
    updateUserProfile,
    changeUserPassword,
    hasPermission,
    hasRole,
    clearError,
    dismissExpired,
  };
};

// FIX: Changed back to Default Export to match all your existing page imports
export { useAuth };