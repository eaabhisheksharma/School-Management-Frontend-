// import React, { lazy, useEffect } from 'react';
// import useAuth from './hooks/useAuth';

// /* ── Lazy-loaded pages ── */
// const Login       = lazy(() => import('./pages/Login'));
// const Dashboard   = lazy(() => import('./pages/Dashboard'));
// const Students    = lazy(() => import('./pages/Students'));
// const Teachers    = lazy(() => import('./pages/Teachers'));
// const Classes     = lazy(() => import('./pages/Classes'));
// const Attendance  = lazy(() => import('./pages/Attendance'));
// const Assignments = lazy(() => import('./pages/Assignments'));
// const Exams       = lazy(() => import('./pages/Exams'));
// const Fees        = lazy(() => import('./pages/Fees'));
// const Notices     = lazy(() => import('./pages/Notices'));
// const Timetable   = lazy(() => import('./pages/Timetable'));
// const NotFound    = lazy(() => import('./pages/NotFound'));

// /* ── Lazy-loaded layout ── */
// const Layout      = lazy(() => import('./components/layout/Layout'));

// /* ════════════════════════════════════════════════════════════
//    ROUTE DEFINITIONS
// ══════════════════════════════════════════════════════════════ */

// /**
//  * Every route entry:
//  * {
//  *   path        : string,
//  *   component   : React.ComponentType,
//  *   private     : boolean,   // requires authentication
//  *   roles       : string[],  // [] = any authenticated role
//  *   permissions : string[],  // [] = no specific permission required
//  *   title       : string,    // document.title suffix
//  *   icon        : string,
//  *   showInNav   : boolean,
//  *   navSection  : string,
//  * }
//  */
// export const ROUTES = [
//   /* ── Public ─────────────────────────────────────────── */
//   {
//     path        : '/login',
//     component   : Login,
//     private     : false,
//     roles       : [],
//     permissions : [],
//     title       : 'Login',
//     icon        : '🔐',
//     showInNav   : false,
//   },

//   /* ── Protected ───────────────────────────────────────── */
//   {
//     path        : '/',
//     redirect    : '/dashboard',
//     private     : true,
//   },
//   {
//     path        : '/dashboard',
//     component   : Dashboard,
//     private     : true,
//     roles       : [],
//     permissions : [],
//     title       : 'Dashboard',
//     icon        : '🏠',
//     showInNav   : true,
//     navSection  : 'main',
//     navOrder    : 1,
//   },
//   {
//     path        : '/students',
//     component   : Students,
//     private     : true,
//     roles       : ['principal', 'teacher', 'accountant'],
//     permissions : ['view_students'],
//     title       : 'Students',
//     icon        : '🎒',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 2,
//   },
//   {
//     path        : '/teachers',
//     component   : Teachers,
//     private     : true,
//     roles       : ['principal'],
//     permissions : ['view_teachers'],
//     title       : 'Teachers',
//     icon        : '👨‍🏫',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 3,
//   },
//   {
//     path        : '/classes',
//     component   : Classes,
//     private     : true,
//     roles       : ['principal', 'teacher'],
//     permissions : ['view_classes'],
//     title       : 'Classes',
//     icon        : '🏫',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 4,
//   },
//   {
//     path        : '/attendance',
//     component   : Attendance,
//     private     : true,
//     roles       : ['principal', 'teacher', 'student', 'parent'],
//     permissions : ['view_attendance'],
//     title       : 'Attendance',
//     icon        : '✅',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 5,
//   },
//   {
//     path        : '/assignments',
//     component   : Assignments,
//     private     : true,
//     roles       : ['principal', 'teacher', 'student'],
//     permissions : ['view_assignments'],
//     title       : 'Assignments',
//     icon        : '📝',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 6,
//   },
//   {
//     path        : '/exams',
//     component   : Exams,
//     private     : true,
//     roles       : ['principal', 'teacher', 'student', 'parent'],
//     permissions : ['view_exams'],
//     title       : 'Exams',
//     icon        : '📋',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 7,
//   },
//   {
//     path        : '/fees',
//     component   : Fees,
//     private     : true,
//     roles       : ['principal', 'accountant', 'student', 'parent'],
//     permissions : ['view_fees'],
//     title       : 'Fees',
//     icon        : '💰',
//     showInNav   : true,
//     navSection  : 'admin',
//     navOrder    : 8,
//   },
//   {
//     path        : '/notices',
//     component   : Notices,
//     private     : true,
//     roles       : [],
//     permissions : ['view_notices'],
//     title       : 'Notices',
//     icon        : '📢',
//     showInNav   : true,
//     navSection  : 'admin',
//     navOrder    : 9,
//   },
//   {
//     path        : '/timetable',
//     component   : Timetable,
//     private     : true,
//     roles       : [],
//     permissions : ['view_timetable'],
//     title       : 'Timetable',
//     icon        : '🗓️',
//     showInNav   : true,
//     navSection  : 'admin',
//     navOrder    : 10,
//   },

//   /* ── 404 ── */
//   {
//     path        : '*',
//     component   : NotFound,
//     private     : false,
//     roles       : [],
//     permissions : [],
//     title       : '404 — Not Found',
//     icon        : '❓',
//     showInNav   : false,
//   },
// ];

// /* ── Nav sections config ── */
// export const NAV_SECTIONS = {
//   main    : { label: 'Overview',   order: 1 },
//   academic: { label: 'Academic',   order: 2 },
//   admin   : { label: 'Management', order: 3 },
// };

// /* ════════════════════════════════════════════════════════════
//    HELPERS
// ══════════════════════════════════════════════════════════════ */

// /** Returns the routes the current user is allowed to see in the nav */
// export const getNavRoutes = (userRole, permissions = []) => {
//   return ROUTES
//     .filter((r) => r.showInNav)
//     .filter((r) => {
//       if (r.roles?.length > 0 && !r.roles.includes(userRole)) return false;
//       if (r.permissions?.length > 0 && !r.permissions.some((p) => permissions.includes(p))) return false;
//       return true;
//     })
//     .sort((a, b) => (a.navOrder || 99) - (b.navOrder || 99));
// };

// /** Get route config for the current pathname */
// export const getRouteByPath = (pathname) =>
//   ROUTES.find((r) => r.path === pathname) || null;

// /* ════════════════════════════════════════════════════════════
//    COMPONENTS
// ══════════════════════════════════════════════════════════════ */

// /* ── Simple hash-based router (no react-router dependency) ── */

// const getCurrentPath = () => {
//   const hash = window.location.hash.replace('#', '') || '/';
//   return hash.startsWith('/') ? hash : '/' + hash;
// };

// const navigate = (to) => {
//   window.location.hash = to;
// };

// /* ── useRouter hook ── */
// const useRouter = () => {
//   const [path, setPath] = React.useState(getCurrentPath);

//   useEffect(() => {
//     const onHashChange = () => setPath(getCurrentPath());
//     window.addEventListener('hashchange', onHashChange);

//     /* Redirect bare "/" → "/#/dashboard" or "/#/login" */
//     if (!window.location.hash) {
//       window.location.hash = '/login';
//     }
//     return () => window.removeEventListener('hashchange', onHashChange);
//   }, []);

//   return { path, navigate };
// };

// /* ── Protected route wrapper ── */
// const ProtectedRoute = ({ route, children }) => {
//   const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return null;
//   if (!isAuthenticated) return null;

//   /* Role check */
//   if (route.roles?.length > 0 && !route.roles.some((r) => hasRole(r))) {
//     return (
//       <div style={{
//         display         : 'flex',
//         flexDirection   : 'column',
//         alignItems      : 'center',
//         justifyContent  : 'center',
//         minHeight       : '60vh',
//         gap             : 12,
//         fontFamily      : 'Inter, system-ui, sans-serif',
//       }}>
//         <div style={{ fontSize: 52 }}>🚫</div>
//         <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Access Denied</h2>
//         <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
//           You don't have permission to view this page.
//         </p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             marginTop     : 8,
//             padding       : '10px 24px',
//             background    : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             color         : 'white',
//             border        : 'none',
//             borderRadius  : 10,
//             fontSize      : 14,
//             fontWeight    : 700,
//             cursor        : 'pointer',
//           }}
//         >
//           🏠 Go to Dashboard
//         </button>
//       </div>
//     );
//   }

//   /* Permission check */
//   if (
//     route.permissions?.length > 0 &&
//     !route.permissions.some((p) => hasPermission(p))
//   ) {
//     return (
//       <div style={{
//         display         : 'flex',
//         flexDirection   : 'column',
//         alignItems      : 'center',
//         justifyContent  : 'center',
//         minHeight       : '60vh',
//         gap             : 12,
//         fontFamily      : 'Inter, system-ui, sans-serif',
//       }}>
//         <div style={{ fontSize: 52 }}>🔒</div>
//         <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Insufficient Permissions</h2>
//         <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
//           You don't have the required permissions for this section.
//         </p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             marginTop     : 8,
//             padding       : '10px 24px',
//             background    : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             color         : 'white',
//             border        : 'none',
//             borderRadius  : 10,
//             fontSize      : 14,
//             fontWeight    : 700,
//             cursor        : 'pointer',
//           }}
//         >
//           🏠 Go to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return children;
// };

// /* ── Page title updater ── */
// const TitleUpdater = ({ title }) => {
//   useEffect(() => {
//     document.title = title
//       ? `${title} — School Management System`
//       : 'School Management System';
//   }, [title]);
//   return null;
// };

// /* ── Public-only route (redirect to dashboard if already logged in) ── */
// const PublicOnlyRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return null;
//   if (isAuthenticated) return null;
//   return children;
// };

// /* ════════════════════════════════════════════════════════════
//    MAIN ROUTER COMPONENT
// ══════════════════════════════════════════════════════════════ */
// const AppRoutes = () => {
//   const { path } = useRouter();
//   const { isAuthenticated } = useAuth();

//   /* ── Match current path to a route ── */
//   const matchedRoute = React.useMemo(() => {
//     /* Exact match */
//     const exact = ROUTES.find((r) => r.path === path);
//     if (exact) return exact;

//     /* Dynamic segments e.g. /students/:id */
//     const dynamic = ROUTES.find((r) => {
//       if (!r.path || r.path === '*') return false;
//       const rParts = r.path.split('/');
//       const pParts = path.split('/');
//       if (rParts.length !== pParts.length) return false;
//       return rParts.every((seg, i) => seg.startsWith(':') || seg === pParts[i]);
//     });
//     if (dynamic) return dynamic;

//     /* Redirect routes */
//     const redirect = ROUTES.find((r) => r.redirect && r.path === path);
//     if (redirect) {
//       navigate(redirect.redirect);
//       return null;
//     }

//     /* Fallback to 404 */
//     return ROUTES.find((r) => r.path === '*') || null;
//   }, [path]);

//   /* ── Root redirect ── */
//   useEffect(() => {
//     if (path === '/') {
//       navigate(isAuthenticated ? '/dashboard' : '/login');
//     }
//   }, [path, isAuthenticated]);

//   if (!matchedRoute) return null;

//   const PageComponent = matchedRoute.component;
//   if (!PageComponent) return null;

//   /* ── Public route (Login, 404) ── */
//   if (!matchedRoute.private) {
//     /* Login page: redirect away if already authenticated */
//     if (matchedRoute.path === '/login') {
//       return (
//         <PublicOnlyRoute>
//           <TitleUpdater title={matchedRoute.title} />
//           <PageComponent />
//         </PublicOnlyRoute>
//       );
//     }
//     /* 404 and other public pages */
//     return (
//       <>
//         <TitleUpdater title={matchedRoute.title} />
//         <PageComponent />
//       </>
//     );
//   }

//   /* ── Private route inside the app shell ── */
//   return (
//     <ProtectedRoute route={matchedRoute}>
//       <TitleUpdater title={matchedRoute.title} />
//       <Layout currentPath={path} navigate={navigate}>
//         <PageComponent />
//       </Layout>
//     </ProtectedRoute>
//   );
// };

// /* Export navigate so any component can call it */
// export { navigate, useRouter };
// export default AppRoutes;

// import useAuth from './hooks/useAuth';


// import React, { lazy, useEffect } from 'react';
// import { useAuth } from './hooks/useAuth';

// /* ── Lazy-loaded pages ── */
// const Login       = lazy(() => import('./pages/Login'));
// const Dashboard   = lazy(() => import('./pages/Dashboard'));
// const Students    = lazy(() => import('./pages/Students'));
// const Teachers    = lazy(() => import('./pages/Teachers'));
// const Classes     = lazy(() => import('./pages/Classes'));
// const Attendance  = lazy(() => import('./pages/Attendance'));
// const Assignments = lazy(() => import('./pages/Assignments'));
// const Exams       = lazy(() => import('./pages/Exams'));
// const Fees        = lazy(() => import('./pages/Fees'));
// const Notices     = lazy(() => import('./pages/Notices'));
// const Timetable   = lazy(() => import('./pages/Timetable'));
// const NotFound    = lazy(() => import('./pages/NotFound'));

// /* ── Lazy-loaded layout ── */
// const Layout      = lazy(() => import('./components/layout/Layout'));

// /* ════════════════════════════════════════════════════════════
//    ROUTE DEFINITIONS
// ══════════════════════════════════════════════════════════════ */

// /**
//  * Every route entry:
//  * {
//  *   path        : string,
//  *   component   : React.ComponentType,
//  *   private     : boolean,   // requires authentication
//  *   roles       : string[],  // [] = any authenticated role
//  *   permissions : string[],  // [] = no specific permission required
//  *   title       : string,    // document.title suffix
//  *   icon        : string,
//  *   showInNav   : boolean,
//  *   navSection  : string,
//  * }
//  */
// export const ROUTES = [
//   /* ── Public ─────────────────────────────────────────── */
//   {
//     path        : '/login',
//     component   : Login,
//     private     : false,
//     roles       : [],
//     permissions : [],
//     title       : 'Login',
//     icon        : '🔐',
//     showInNav   : false,
//   },

//   /* ── Protected ───────────────────────────────────────── */
//   {
//     path        : '/',
//     redirect    : '/dashboard',
//     private     : true,
//   },
//   {
//     path        : '/dashboard',
//     component   : Dashboard,
//     private     : true,
//     roles       : [], // Accessible by all authenticated users
//     permissions : [],
//     title       : 'Dashboard',
//     icon        : '🏠',
//     showInNav   : true,
//     navSection  : 'main',
//     navOrder    : 1,
//   },
  
//   /* ── Super Admin Section ────────────────────────────── */
//   // NOTE: You will need to create a SchoolManagement.jsx page for this
//   // {
//   //   path        : '/admin/schools',
//   //   component   : SchoolManagement,
//   //   private     : true,
//   //   roles       : ['superadmin'], // ONLY Super Admin can see this
//   //   permissions : [],
//   //   title       : 'Manage Schools',
//   //   icon        : '🏛️',
//   //   showInNav   : true,
//   //   navSection  : 'superadmin',
//   //   navOrder    : 1,
//   // },

//   /* ── Academic ───────────────────────────────────────── */
//   {
//     path        : '/students',
//     component   : Students,
//     private     : true,
//     // Added 'superadmin' to allowed roles
//     roles       : ['principal', 'teacher', 'accountant', 'superadmin'],
//     permissions : ['view_students'],
//     title       : 'Students',
//     icon        : '🎒',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 2,
//   },
//   {
//     path        : '/teachers',
//     component   : Teachers,
//     private     : true,
//     // Added 'superadmin' to allowed roles
//     roles       : ['principal', 'superadmin'],
//     permissions : ['view_teachers'],
//     title       : 'Teachers',
//     icon        : '👨‍🏫',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 3,
//   },
//   {
//     path        : '/classes',
//     component   : Classes,
//     private     : true,
//     // Added 'superadmin' to allowed roles
//     roles       : ['principal', 'teacher', 'superadmin'],
//     permissions : ['view_classes'],
//     title       : 'Classes',
//     icon        : '🏫',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 4,
//   },
//   {
//     path        : '/attendance',
//     component   : Attendance,
//     private     : true,
//     roles       : ['principal', 'teacher', 'student', 'parent', 'superadmin'],
//     permissions : ['view_attendance'],
//     title       : 'Attendance',
//     icon        : '✅',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 5,
//   },
//   {
//     path        : '/assignments',
//     component   : Assignments,
//     private     : true,
//     roles       : ['principal', 'teacher', 'student', 'superadmin'],
//     permissions : ['view_assignments'],
//     title       : 'Assignments',
//     icon        : '📝',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 6,
//   },
//   {
//     path        : '/exams',
//     component   : Exams,
//     private     : true,
//     roles       : ['principal', 'teacher', 'student', 'parent', 'superadmin'],
//     permissions : ['view_exams'],
//     title       : 'Exams',
//     icon        : '📋',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 7,
//   },

//   /* ── Management ──────────────────────────────────────── */
//   {
//     path        : '/fees',
//     component   : Fees,
//     private     : true,
//     roles       : ['principal', 'accountant', 'student', 'parent', 'superadmin'],
//     permissions : ['view_fees'],
//     title       : 'Fees',
//     icon        : '💰',
//     showInNav   : true,
//     navSection  : 'admin',
//     navOrder    : 8,
//   },
//   {
//     path        : '/notices',
//     component   : Notices,
//     private     : true,
//     roles       : [], // Accessible by all
//     permissions : ['view_notices'],
//     title       : 'Notices',
//     icon        : '📢',
//     showInNav   : true,
//     navSection  : 'admin',
//     navOrder    : 9,
//   },
//   {
//     path        : '/timetable',
//     component   : Timetable,
//     private     : true,
//     roles       : [], // Accessible by all
//     permissions : ['view_timetable'],
//     title       : 'Timetable',
//     icon        : '🗓️',
//     showInNav   : true,
//     navSection  : 'admin',
//     navOrder    : 10,
//   },

//   /* ── 404 ── */
//   {
//     path        : '*',
//     component   : NotFound,
//     private     : false,
//     roles       : [],
//     permissions : [],
//     title       : '404 — Not Found',
//     icon        : '❓',
//     showInNav   : false,
//   },
// ];

// /* ── Nav sections config ── */
// export const NAV_SECTIONS = {
//   main       : { label: 'Overview',      order: 1 },
//   superadmin : { label: 'Super Admin',   order: 2 }, // New Section
//   academic   : { label: 'Academic',      order: 3 },
//   admin      : { label: 'Management',    order: 4 },
// };

// /* ════════════════════════════════════════════════════════════
//    HELPERS
// ══════════════════════════════════════════════════════════════ */

// /** Returns the routes the current user is allowed to see in the nav */
// export const getNavRoutes = (userRole, permissions = []) => {
//   return ROUTES
//     .filter((r) => r.showInNav)
//     .filter((r) => {
//       if (r.roles?.length > 0 && !r.roles.includes(userRole)) return false;
//       if (r.permissions?.length > 0 && !r.permissions.some((p) => permissions.includes(p))) return false;
//       return true;
//     })
//     .sort((a, b) => (a.navOrder || 99) - (b.navOrder || 99));
// };

// /** Get route config for the current pathname */
// export const getRouteByPath = (pathname) =>
//   ROUTES.find((r) => r.path === pathname) || null;

// /* ════════════════════════════════════════════════════════════
//    COMPONENTS
// ══════════════════════════════════════════════════════════════ */

// /* ── Simple hash-based router (no react-router dependency) ── */

// const getCurrentPath = () => {
//   const hash = window.location.hash.replace('#', '') || '/';
//   return hash.startsWith('/') ? hash : '/' + hash;
// };

// const navigate = (to) => {
//   window.location.hash = to;
// };

// /* ── useRouter hook ── */
// const useRouter = () => {
//   const [path, setPath] = React.useState(getCurrentPath);

//   useEffect(() => {
//     const onHashChange = () => setPath(getCurrentPath());
//     window.addEventListener('hashchange', onHashChange);

//     /* Redirect bare "/" → "/#/dashboard" or "/#/login" */
//     if (!window.location.hash) {
//       window.location.hash = '/login';
//     }
//     return () => window.removeEventListener('hashchange', onHashChange);
//   }, []);

//   return { path, navigate };
// };

// /* ── Protected route wrapper ── */
// const ProtectedRoute = ({ route, children }) => {
//   const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return null;
//   if (!isAuthenticated) return null;

//   /* Role check */
//   if (route.roles?.length > 0 && !route.roles.some((r) => hasRole(r))) {
//     return (
//       <div style={{
//         display         : 'flex',
//         flexDirection   : 'column',
//         alignItems      : 'center',
//         justifyContent  : 'center',
//         minHeight       : '60vh',
//         gap             : 12,
//         fontFamily      : 'Inter, system-ui, sans-serif',
//       }}>
//         <div style={{ fontSize: 52 }}>🚫</div>
//         <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Access Denied</h2>
//         <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
//           You don't have permission to view this page.
//         </p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             marginTop     : 8,
//             padding       : '10px 24px',
//             background    : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             color         : 'white',
//             border        : 'none',
//             borderRadius  : 10,
//             fontSize      : 14,
//             fontWeight    : 700,
//             cursor        : 'pointer',
//           }}
//         >
//           🏠 Go to Dashboard
//         </button>
//       </div>
//     );
//   }

//   /* Permission check */
//   if (
//     route.permissions?.length > 0 &&
//     !route.permissions.some((p) => hasPermission(p))
//   ) {
//     return (
//       <div style={{
//         display         : 'flex',
//         flexDirection   : 'column',
//         alignItems      : 'center',
//         justifyContent  : 'center',
//         minHeight       : '60vh',
//         gap             : 12,
//         fontFamily      : 'Inter, system-ui, sans-serif',
//       }}>
//         <div style={{ fontSize: 52 }}>🔒</div>
//         <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Insufficient Permissions</h2>
//         <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
//           You don't have the required permissions for this section.
//         </p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             marginTop     : 8,
//             padding       : '10px 24px',
//             background    : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             color         : 'white',
//             border        : 'none',
//             borderRadius  : 10,
//             fontSize      : 14,
//             fontWeight    : 700,
//             cursor        : 'pointer',
//           }}
//         >
//           🏠 Go to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return children;
// };

// /* ── Page title updater ── */
// const TitleUpdater = ({ title }) => {
//   useEffect(() => {
//     document.title = title
//       ? `${title} — School Management System`
//       : 'School Management System';
//   }, [title]);
//   return null;
// };

// /* ── Public-only route (redirect to dashboard if already logged in) ── */
// const PublicOnlyRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return null;
//   if (isAuthenticated) return null;
//   return children;
// };

// /* ════════════════════════════════════════════════════════════
//    MAIN ROUTER COMPONENT
// ══════════════════════════════════════════════════════════════ */
// const AppRoutes = () => {
//   const { path } = useRouter();
//   const { isAuthenticated } = useAuth();

//   /* ── Match current path to a route ── */
//   const matchedRoute = React.useMemo(() => {
//     /* Exact match */
//     const exact = ROUTES.find((r) => r.path === path);
//     if (exact) return exact;

//     /* Dynamic segments e.g. /students/:id */
//     const dynamic = ROUTES.find((r) => {
//       if (!r.path || r.path === '*') return false;
//       const rParts = r.path.split('/');
//       const pParts = path.split('/');
//       if (rParts.length !== pParts.length) return false;
//       return rParts.every((seg, i) => seg.startsWith(':') || seg === pParts[i]);
//     });
//     if (dynamic) return dynamic;

//     /* Redirect routes */
//     const redirect = ROUTES.find((r) => r.redirect && r.path === path);
//     if (redirect) {
//       navigate(redirect.redirect);
//       return null;
//     }

//     /* Fallback to 404 */
//     return ROUTES.find((r) => r.path === '*') || null;
//   }, [path]);

//   /* ── Root redirect ── */
//   useEffect(() => {
//     if (path === '/') {
//       navigate(isAuthenticated ? '/dashboard' : '/login');
//     }
//   }, [path, isAuthenticated]);

//   if (!matchedRoute) return null;

//   const PageComponent = matchedRoute.component;
//   if (!PageComponent) return null;

//   /* ── Public route (Login, 404) ── */
//   if (!matchedRoute.private) {
//     /* Login page: redirect away if already authenticated */
//     if (matchedRoute.path === '/login') {
//       return (
//         <PublicOnlyRoute>
//           <TitleUpdater title={matchedRoute.title} />
//           <PageComponent />
//         </PublicOnlyRoute>
//       );
//     }
//     /* 404 and other public pages */
//     return (
//       <>
//         <TitleUpdater title={matchedRoute.title} />
//         <PageComponent />
//       </>
//     );
//   }

//   /* ── Private route inside the app shell ── */
//   return (
//     <ProtectedRoute route={matchedRoute}>
//       <TitleUpdater title={matchedRoute.title} />
//       <Layout currentPath={path} navigate={navigate}>
//         <PageComponent />
//       </Layout>
//     </ProtectedRoute>
//   );
// };

// /* Export navigate so any component can call it */
// export { navigate, useRouter };
// export default AppRoutes;


// // src/routes.jsx

// import React, { lazy, useEffect } from 'react';
// import { useAuth } from './hooks/useAuth';

// /* ── Lazy-loaded pages ── */
// const Login       = lazy(() => import('./pages/Login'));
// const Dashboard   = lazy(() => import('./pages/Dashboard'));
// const Students    = lazy(() => import('./pages/Students'));
// const Teachers    = lazy(() => import('./pages/Teachers'));
// const Classes     = lazy(() => import('./pages/Classes'));
// const Attendance  = lazy(() => import('./pages/Attendance'));
// const Assignments = lazy(() => import('./pages/Assignments'));
// const Exams       = lazy(() => import('./pages/Exams'));
// const Fees        = lazy(() => import('./pages/Fees'));
// const Notices     = lazy(() => import('./pages/Notices'));
// const Timetable   = lazy(() => import('./pages/Timetable'));
// const NotFound    = lazy(() => import('./pages/NotFound'));

// /* ── Lazy-loaded layout ── */
// const Layout      = lazy(() => import('./components/layout/Layout'));

// /* ════════════════════════════════════════════════════════════
//    ROUTE DEFINITIONS
// ══════════════════════════════════════════════════════════════ */

// export const ROUTES = [
//   /* ── Public ─────────────────────────────────────────── */
//   {
//     path        : '/login',
//     component   : Login,
//     private     : false,
//     roles       : [],
//     permissions : [],
//     title       : 'Login',
//     icon        : '🔐',
//     showInNav   : false,
//   },

//   /* ── Protected ───────────────────────────────────────── */
//   {
//     path        : '/',
//     redirect    : '/dashboard',
//     private     : true,
//   },
//   {
//     path        : '/dashboard',
//     component   : Dashboard,
//     private     : true,
//     roles       : [], // Accessible by all authenticated users
//     permissions : [],
//     title       : 'Dashboard',
//     icon        : '🏠',
//     showInNav   : true,
//     navSection  : 'main',
//     navOrder    : 1,
//   },
  
//   /* ── Academic ───────────────────────────────────────── */
//   {
//     path        : '/students',
//     component   : Students,
//     private     : true,
//     // FIX: Changed 'superadmin' to 'super_admin' to match backend
//     roles       : ['principal', 'teacher', 'accountant', 'super_admin'],
//     permissions : ['view_students'],
//     title       : 'Students',
//     icon        : '🎒',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 2,
//   },
//   {
//     path        : '/teachers',
//     component   : Teachers,
//     private     : true,
//     // FIX: Changed 'superadmin' to 'super_admin'
//     roles       : ['principal', 'super_admin'],
//     permissions : ['view_teachers'],
//     title       : 'Teachers',
//     icon        : '👨‍🏫',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 3,
//   },
//   {
//     path        : '/classes',
//     component   : Classes,
//     private     : true,
//     // FIX: Changed 'superadmin' to 'super_admin'
//     roles       : ['principal', 'teacher', 'super_admin'],
//     permissions : ['view_classes'],
//     title       : 'Classes',
//     icon        : '🏫',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 4,
//   },
//   {
//     path        : '/attendance',
//     component   : Attendance,
//     private     : true,
//     roles       : ['principal', 'teacher', 'student', 'parent', 'super_admin'],
//     permissions : ['view_attendance'],
//     title       : 'Attendance',
//     icon        : '✅',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 5,
//   },
//   {
//     path        : '/assignments',
//     component   : Assignments,
//     private     : true,
//     roles       : ['principal', 'teacher', 'student', 'super_admin'],
//     permissions : ['view_assignments'],
//     title       : 'Assignments',
//     icon        : '📝',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 6,
//   },
//   {
//     path        : '/exams',
//     component   : Exams,
//     private     : true,
//     roles       : ['principal', 'teacher', 'student', 'parent', 'super_admin'],
//     permissions : ['view_exams'],
//     title       : 'Exams',
//     icon        : '📋',
//     showInNav   : true,
//     navSection  : 'academic',
//     navOrder    : 7,
//   },

//   /* ── Management ──────────────────────────────────────── */
//   {
//     path        : '/fees',
//     component   : Fees,
//     private     : true,
//     roles       : ['principal', 'accountant', 'student', 'parent', 'super_admin'],
//     permissions : ['view_fees'],
//     title       : 'Fees',
//     icon        : '💰',
//     showInNav   : true,
//     navSection  : 'admin',
//     navOrder    : 8,
//   },
//   {
//     path        : '/notices',
//     component   : Notices,
//     private     : true,
//     roles       : [], // Accessible by all
//     permissions : ['view_notices'],
//     title       : 'Notices',
//     icon        : '📢',
//     showInNav   : true,
//     navSection  : 'admin',
//     navOrder    : 9,
//   },
//   {
//     path        : '/timetable',
//     component   : Timetable,
//     private     : true,
//     roles       : [], // Accessible by all
//     permissions : ['view_timetable'],
//     title       : 'Timetable',
//     icon        : '🗓️',
//     showInNav   : true,
//     navSection  : 'admin',
//     navOrder    : 10,
//   },

//   /* ── 404 ── */
//   {
//     path        : '*',
//     component   : NotFound,
//     private     : false,
//     roles       : [],
//     permissions : [],
//     title       : '404 — Not Found',
//     icon        : '❓',
//     showInNav   : false,
//   },
// ];

// /* ── Nav sections config ── */
// export const NAV_SECTIONS = {
//   main       : { label: 'Overview',      order: 1 },
//   superadmin : { label: 'Super Admin',   order: 2 },
//   academic   : { label: 'Academic',      order: 3 },
//   admin      : { label: 'Management',    order: 4 },
// };

// /* ════════════════════════════════════════════════════════════
//    HELPERS
// ══════════════════════════════════════════════════════════════ */

// /** Returns the routes the current user is allowed to see in the nav */
// export const getNavRoutes = (userRole, permissions = []) => {
//   return ROUTES
//     .filter((r) => r.showInNav)
//     .filter((r) => {
//       // If roles array is empty, it's accessible to everyone
//       if (r.roles?.length > 0 && !r.roles.includes(userRole)) return false;
//       if (r.permissions?.length > 0 && !r.permissions.some((p) => permissions.includes(p))) return false;
//       return true;
//     })
//     .sort((a, b) => (a.navOrder || 99) - (b.navOrder || 99));
// };

// /** Get route config for the current pathname */
// export const getRouteByPath = (pathname) =>
//   ROUTES.find((r) => r.path === pathname) || null;

// /* ════════════════════════════════════════════════════════════
//    COMPONENTS
// ══════════════════════════════════════════════════════════════ */

// /* ── Simple hash-based router ── */

// const getCurrentPath = () => {
//   const hash = window.location.hash.replace('#', '') || '/';
//   return hash.startsWith('/') ? hash : '/' + hash;
// };

// const navigate = (to) => {
//   window.location.hash = to;
// };

// /* ── useRouter hook ── */
// const useRouter = () => {
//   const [path, setPath] = React.useState(getCurrentPath);

//   useEffect(() => {
//     const onHashChange = () => setPath(getCurrentPath());
//     window.addEventListener('hashchange', onHashChange);

//     if (!window.location.hash) {
//       window.location.hash = '/login';
//     }
//     return () => window.removeEventListener('hashchange', onHashChange);
//   }, []);

//   return { path, navigate };
// };

// /* ── Protected route wrapper ── */
// const ProtectedRoute = ({ route, children }) => {
//   const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return null;
//   if (!isAuthenticated) return null;

//   /* Role check */
//   if (route.roles?.length > 0 && !route.roles.some((r) => hasRole(r))) {
//     return (
//       <div style={{
//         display         : 'flex',
//         flexDirection   : 'column',
//         alignItems      : 'center',
//         justifyContent  : 'center',
//         minHeight       : '60vh',
//         gap             : 12,
//         fontFamily      : 'Inter, system-ui, sans-serif',
//       }}>
//         <div style={{ fontSize: 52 }}>🚫</div>
//         <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Access Denied</h2>
//         <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
//           You don't have permission to view this page.
//         </p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             marginTop     : 8,
//             padding       : '10px 24px',
//             background    : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             color         : 'white',
//             border        : 'none',
//             borderRadius  : 10,
//             fontSize      : 14,
//             fontWeight    : 700,
//             cursor        : 'pointer',
//           }}
//         >
//           🏠 Go to Dashboard
//         </button>
//       </div>
//     );
//   }

//   /* Permission check */
//   if (
//     route.permissions?.length > 0 &&
//     !route.permissions.some((p) => hasPermission(p))
//   ) {
//     return (
//       <div style={{
//         display         : 'flex',
//         flexDirection   : 'column',
//         alignItems      : 'center',
//         justifyContent  : 'center',
//         minHeight       : '60vh',
//         gap             : 12,
//         fontFamily      : 'Inter, system-ui, sans-serif',
//       }}>
//         <div style={{ fontSize: 52 }}>🔒</div>
//         <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Insufficient Permissions</h2>
//         <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
//           You don't have the required permissions for this section.
//         </p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             marginTop     : 8,
//             padding       : '10px 24px',
//             background    : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             color         : 'white',
//             border        : 'none',
//             borderRadius  : 10,
//             fontSize      : 14,
//             fontWeight    : 700,
//             cursor        : 'pointer',
//           }}
//         >
//           🏠 Go to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return children;
// };

// /* ── Page title updater ── */
// const TitleUpdater = ({ title }) => {
//   useEffect(() => {
//     document.title = title
//       ? `${title} — School Management System`
//       : 'School Management System';
//   }, [title]);
//   return null;
// };

// /* ── Public-only route ── */
// const PublicOnlyRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return null;
//   if (isAuthenticated) return null;
//   return children;
// };

// /* ════════════════════════════════════════════════════════════
//    MAIN ROUTER COMPONENT
// ══════════════════════════════════════════════════════════════ */
// const AppRoutes = () => {
//   const { path } = useRouter();
//   const { isAuthenticated } = useAuth();

//   const matchedRoute = React.useMemo(() => {
//     const exact = ROUTES.find((r) => r.path === path);
//     if (exact) return exact;

//     const dynamic = ROUTES.find((r) => {
//       if (!r.path || r.path === '*') return false;
//       const rParts = r.path.split('/');
//       const pParts = path.split('/');
//       if (rParts.length !== pParts.length) return false;
//       return rParts.every((seg, i) => seg.startsWith(':') || seg === pParts[i]);
//     });
//     if (dynamic) return dynamic;

//     const redirect = ROUTES.find((r) => r.redirect && r.path === path);
//     if (redirect) {
//       navigate(redirect.redirect);
//       return null;
//     }

//     return ROUTES.find((r) => r.path === '*') || null;
//   }, [path]);

//   useEffect(() => {
//     if (path === '/') {
//       navigate(isAuthenticated ? '/dashboard' : '/login');
//     }
//   }, [path, isAuthenticated]);

//   if (!matchedRoute) return null;

//   const PageComponent = matchedRoute.component;
//   if (!PageComponent) return null;

//   if (!matchedRoute.private) {
//     if (matchedRoute.path === '/login') {
//       return (
//         <PublicOnlyRoute>
//           <TitleUpdater title={matchedRoute.title} />
//           <PageComponent />
//         </PublicOnlyRoute>
//       );
//     }
//     return (
//       <>
//         <TitleUpdater title={matchedRoute.title} />
//         <PageComponent />
//       </>
//     );
//   }

//   return (
//     <ProtectedRoute route={matchedRoute}>
//       <TitleUpdater title={matchedRoute.title} />
//       <Layout currentPath={path} navigate={navigate}>
//         <PageComponent />
//       </Layout>
//     </ProtectedRoute>
//   );
// };

// export { navigate, useRouter };
// export default AppRoutes;



// // src/routes.jsx

// import React, { lazy, useEffect } from 'react';
// import { useAuth } from './hooks/useAuth';

// /* ── Lazy-loaded pages ── */
// const Login = lazy(() => import('./pages/Login'));
// const Dashboard = lazy(() => import('./pages/Dashboard'));
// const Students = lazy(() => import('./pages/Students'));
// const Teachers = lazy(() => import('./pages/Teachers'));
// const Classes = lazy(() => import('./pages/Classes'));
// const Attendance = lazy(() => import('./pages/Attendance'));
// const Assignments = lazy(() => import('./pages/Assignments'));
// const Exams = lazy(() => import('./pages/Exams'));
// const Fees = lazy(() => import('./pages/Fees'));
// const Notices = lazy(() => import('./pages/Notices'));
// const Timetable = lazy(() => import('./pages/Timetable'));
// const NotFound = lazy(() => import('./pages/NotFound'));

// /* ── Lazy-loaded admin components/pages ── */
// const AdminStats = lazy(() => import('./components/admin/AdminStats'));
// const SchoolList = lazy(() => import('./components/admin/SchoolList'));
// const SchoolForm = lazy(() => import('./components/admin/SchoolForm'));
// const SchoolSubscription = lazy(() => import('./components/admin/SchoolSubscription'));
// const UserList = lazy(() => import('./components/admin/UserList'));
// const ActivityLogs = lazy(() => import('./components/admin/ActivityLogs'));
// const SystemSettings = lazy(() => import('./components/admin/SystemSettings'));

// /* ── Lazy-loaded layout ── */
// const Layout = lazy(() => import('./components/layout/Layout'));

// /* ════════════════════════════════════════════════════════════
//    ROUTE DEFINITIONS
// ══════════════════════════════════════════════════════════════ */

// export const ROUTES = [
//   /* ── Public ─────────────────────────────────────────── */
//   {
//     path: '/login',
//     component: Login,
//     private: false,
//     roles: [],
//     permissions: [],
//     title: 'Login',
//     icon: '🔐',
//     showInNav: false,
//   },

//   /* ── Protected ───────────────────────────────────────── */
//   {
//     path: '/',
//     redirect: '/dashboard',
//     private: true,
//   },
//   {
//     path: '/dashboard',
//     component: Dashboard,
//     private: true,
//     roles: [],
//     permissions: [],
//     title: 'Dashboard',
//     icon: '🏠',
//     showInNav: true,
//     navSection: 'main',
//     navOrder: 1,
//   },

//   /* ── Super Admin ─────────────────────────────────────── */
//   {
//     path: '/admin/stats',
//     component: AdminStats,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_admin_dashboard', 'view_system_stats'],
//     title: 'Admin Stats',
//     icon: '📊',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 2,
//   },
//   {
//     path: '/admin/schools',
//     component: SchoolList,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_schools'],
//     title: 'Schools',
//     icon: '🏫',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 3,
//   },
//   {
//     path: '/admin/schools/create',
//     component: SchoolForm,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['create_school'],
//     title: 'Add School',
//     icon: '➕',
//     showInNav: false,
//     navSection: 'super_admin',
//     navOrder: 4,
//   },
//   {
//     path: '/admin/schools/edit/:id',
//     component: SchoolForm,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['edit_school'],
//     title: 'Edit School',
//     icon: '✏️',
//     showInNav: false,
//     navSection: 'super_admin',
//     navOrder: 5,
//   },
//   {
//     path: '/admin/subscriptions',
//     component: SchoolSubscription,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_subscriptions'],
//     title: 'Subscriptions',
//     icon: '💳',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 6,
//   },
//   {
//     path: '/admin/users',
//     component: UserList,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_users'],
//     title: 'Users',
//     icon: '👥',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 7,
//   },
//   {
//     path: '/admin/logs',
//     component: ActivityLogs,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_activity_logs'],
//     title: 'Activity Logs',
//     icon: '📜',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 8,
//   },
//   {
//     path: '/admin/settings',
//     component: SystemSettings,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['manage_system_settings'],
//     title: 'System Settings',
//     icon: '⚙️',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 9,
//   },

//   /* ── Academic ───────────────────────────────────────── */
//   {
//     path: '/students',
//     component: Students,
//     private: true,
//     roles: ['principal', 'teacher', 'accountant', 'super_admin'],
//     permissions: ['view_students'],
//     title: 'Students',
//     icon: '🎒',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 10,
//   },
//   {
//     path: '/teachers',
//     component: Teachers,
//     private: true,
//     roles: ['principal', 'super_admin'],
//     permissions: ['view_teachers'],
//     title: 'Teachers',
//     icon: '👨‍🏫',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 11,
//   },
//   {
//     path: '/classes',
//     component: Classes,
//     private: true,
//     roles: ['principal', 'teacher', 'super_admin'],
//     permissions: ['view_classes'],
//     title: 'Classes',
//     icon: '🏫',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 12,
//   },
//   {
//     path: '/attendance',
//     component: Attendance,
//     private: true,
//     roles: ['principal', 'teacher', 'student', 'parent', 'super_admin'],
//     permissions: ['view_attendance'],
//     title: 'Attendance',
//     icon: '✅',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 13,
//   },
//   {
//     path: '/assignments',
//     component: Assignments,
//     private: true,
//     roles: ['principal', 'teacher', 'student', 'super_admin'],
//     permissions: ['view_assignments'],
//     title: 'Assignments',
//     icon: '📝',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 14,
//   },
//   {
//     path: '/exams',
//     component: Exams,
//     private: true,
//     roles: ['principal', 'teacher', 'student', 'parent', 'super_admin'],
//     permissions: ['view_exams'],
//     title: 'Exams',
//     icon: '📋',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 15,
//   },

//   /* ── Management ──────────────────────────────────────── */
//   {
//     path: '/fees',
//     component: Fees,
//     private: true,
//     roles: ['principal', 'accountant', 'student', 'parent', 'super_admin'],
//     permissions: ['view_fees'],
//     title: 'Fees',
//     icon: '💰',
//     showInNav: true,
//     navSection: 'admin',
//     navOrder: 16,
//   },
//   {
//     path: '/notices',
//     component: Notices,
//     private: true,
//     roles: [],
//     permissions: ['view_notices'],
//     title: 'Notices',
//     icon: '📢',
//     showInNav: true,
//     navSection: 'admin',
//     navOrder: 17,
//   },
//   {
//     path: '/timetable',
//     component: Timetable,
//     private: true,
//     roles: [],
//     permissions: ['view_timetable'],
//     title: 'Timetable',
//     icon: '🗓️',
//     showInNav: true,
//     navSection: 'admin',
//     navOrder: 18,
//   },

//   /* ── 404 ── */
//   {
//     path: '*',
//     component: NotFound,
//     private: false,
//     roles: [],
//     permissions: [],
//     title: '404 — Not Found',
//     icon: '❓',
//     showInNav: false,
//   },
// ];

// /* ── Nav sections config ── */
// export const NAV_SECTIONS = {
//   main: { label: 'Overview', order: 1 },
//   super_admin: { label: 'Super Admin', order: 2 },
//   academic: { label: 'Academic', order: 3 },
//   admin: { label: 'Management', order: 4 },
// };

// /* ════════════════════════════════════════════════════════════
//    HELPERS
// ══════════════════════════════════════════════════════════════ */

// /** Returns the routes the current user is allowed to see in the nav */
// export const getNavRoutes = (userRole, permissions = []) => {
//   return ROUTES
//     .filter((r) => r.showInNav)
//     .filter((r) => {
//       if (r.roles?.length > 0 && !r.roles.includes(userRole)) return false;
//       if (r.permissions?.length > 0 && !r.permissions.some((p) => permissions.includes(p))) return false;
//       return true;
//     })
//     .sort((a, b) => (a.navOrder || 99) - (b.navOrder || 99));
// };

// /** Get route config for the current pathname */
// export const getRouteByPath = (pathname) =>
//   ROUTES.find((r) => r.path === pathname) || null;

// /* ════════════════════════════════════════════════════════════
//    COMPONENTS
// ══════════════════════════════════════════════════════════════ */

// const getCurrentPath = () => {
//   const hash = window.location.hash.replace('#', '') || '/';
//   return hash.startsWith('/') ? hash : '/' + hash;
// };

// const navigate = (to) => {
//   window.location.hash = to;
// };

// const useRouter = () => {
//   const [path, setPath] = React.useState(getCurrentPath);

//   useEffect(() => {
//     const onHashChange = () => setPath(getCurrentPath());
//     window.addEventListener('hashchange', onHashChange);

//     if (!window.location.hash) {
//       window.location.hash = '/login';
//     }

//     return () => window.removeEventListener('hashchange', onHashChange);
//   }, []);

//   return { path, navigate };
// };

// const ProtectedRoute = ({ route, children }) => {
//   const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return null;
//   if (!isAuthenticated) return null;

//   if (route.roles?.length > 0 && !route.roles.some((r) => hasRole(r))) {
//     return (
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           minHeight: '60vh',
//           gap: 12,
//           fontFamily: 'Inter, system-ui, sans-serif',
//         }}
//       >
//         <div style={{ fontSize: 52 }}>🚫</div>
//         <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Access Denied</h2>
//         <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
//           You don&apos;t have permission to view this page.
//         </p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             marginTop: 8,
//             padding: '10px 24px',
//             background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             color: 'white',
//             border: 'none',
//             borderRadius: 10,
//             fontSize: 14,
//             fontWeight: 700,
//             cursor: 'pointer',
//           }}
//         >
//           🏠 Go to Dashboard
//         </button>
//       </div>
//     );
//   }

//   if (route.permissions?.length > 0 && !route.permissions.some((p) => hasPermission(p))) {
//     return (
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           minHeight: '60vh',
//           gap: 12,
//           fontFamily: 'Inter, system-ui, sans-serif',
//         }}
//       >
//         <div style={{ fontSize: 52 }}>🔒</div>
//         <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Insufficient Permissions</h2>
//         <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
//           You don&apos;t have the required permissions for this section.
//         </p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             marginTop: 8,
//             padding: '10px 24px',
//             background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             color: 'white',
//             border: 'none',
//             borderRadius: 10,
//             fontSize: 14,
//             fontWeight: 700,
//             cursor: 'pointer',
//           }}
//         >
//           🏠 Go to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return children;
// };

// const TitleUpdater = ({ title }) => {
//   useEffect(() => {
//     document.title = title
//       ? `${title} — School Management System`
//       : 'School Management System';
//   }, [title]);

//   return null;
// };

// const PublicOnlyRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return null;
//   if (isAuthenticated) return null;
//   return children;
// };

// /* ════════════════════════════════════════════════════════════
//    MAIN ROUTER COMPONENT
// ══════════════════════════════════════════════════════════════ */
// const AppRoutes = () => {
//   const { path } = useRouter();
//   const { isAuthenticated } = useAuth();

//   const matchedRoute = React.useMemo(() => {
//     const exact = ROUTES.find((r) => r.path === path);
//     if (exact) return exact;

//     const dynamic = ROUTES.find((r) => {
//       if (!r.path || r.path === '*') return false;

//       const rParts = r.path.split('/');
//       const pParts = path.split('/');

//       if (rParts.length !== pParts.length) return false;

//       return rParts.every((seg, i) => seg.startsWith(':') || seg === pParts[i]);
//     });

//     if (dynamic) return dynamic;

//     const redirect = ROUTES.find((r) => r.redirect && r.path === path);
//     if (redirect) {
//       navigate(redirect.redirect);
//       return null;
//     }

//     return ROUTES.find((r) => r.path === '*') || null;
//   }, [path]);

//   useEffect(() => {
//     if (path === '/') {
//       navigate(isAuthenticated ? '/dashboard' : '/login');
//     }
//   }, [path, isAuthenticated]);

//   if (!matchedRoute) return null;

//   const PageComponent = matchedRoute.component;
//   if (!PageComponent) return null;

//   if (!matchedRoute.private) {
//     if (matchedRoute.path === '/login') {
//       return (
//         <PublicOnlyRoute>
//           <TitleUpdater title={matchedRoute.title} />
//           <PageComponent />
//         </PublicOnlyRoute>
//       );
//     }

//     return (
//       <>
//         <TitleUpdater title={matchedRoute.title} />
//         <PageComponent />
//       </>
//     );
//   }

//   return (
//     <ProtectedRoute route={matchedRoute}>
//       <TitleUpdater title={matchedRoute.title} />
//       <Layout currentPath={path} navigate={navigate}>
//         <PageComponent />
//       </Layout>
//     </ProtectedRoute>
//   );
// };

// export { navigate, useRouter };
// export default AppRoutes;




// // src/routes.jsx

// import React, { lazy, useEffect, Suspense } from 'react';
// import { useAuth } from './hooks/useAuth';

// /* ── Lazy-loaded pages ── */
// const Login = lazy(() => import('./pages/Login'));
// const Dashboard = lazy(() => import('./pages/Dashboard'));
// const Students = lazy(() => import('./pages/Students'));
// const Teachers = lazy(() => import('./pages/Teachers'));
// const Classes = lazy(() => import('./pages/Classes'));
// const Attendance = lazy(() => import('./pages/Attendance'));
// const Assignments = lazy(() => import('./pages/Assignments'));
// const Exams = lazy(() => import('./pages/Exams'));
// const Fees = lazy(() => import('./pages/Fees'));
// const Notices = lazy(() => import('./pages/Notices'));
// const Timetable = lazy(() => import('./pages/Timetable'));
// const NotFound = lazy(() => import('./pages/NotFound'));

// /* ── Lazy-loaded admin components/pages ── */
// const AdminStats = lazy(() => import('./components/admin/AdminStats'));
// const SchoolList = lazy(() => import('./components/admin/SchoolList'));
// const SchoolForm = lazy(() => import('./components/admin/SchoolForm'));
// const SchoolSubscription = lazy(() => import('./components/admin/SchoolSubscription'));
// const UserList = lazy(() => import('./components/admin/UserList'));
// const ActivityLogs = lazy(() => import('./components/admin/ActivityLogs'));
// const SystemSettings = lazy(() => import('./components/admin/SystemSettings'));

// /* ── Lazy-loaded layout ── */
// const Layout = lazy(() => import('./components/layout/Layout'));

// const PageLoader = () => (
//   <div
//     style={{
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: '#f8fafc',
//       color: '#64748b',
//       fontFamily: 'Inter, system-ui, sans-serif',
//       fontSize: 14,
//     }}
//   >
//     Loading...
//   </div>
// );

// /* ════════════════════════════════════════════════════════════
//    ROUTE DEFINITIONS
// ══════════════════════════════════════════════════════════════ */

// export const ROUTES = [
//   {
//     path: '/login',
//     component: Login,
//     private: false,
//     roles: [],
//     permissions: [],
//     title: 'Login',
//     icon: '🔐',
//     showInNav: false,
//   },
//   {
//     path: '/',
//     redirect: '/dashboard',
//     private: true,
//   },
//   {
//     path: '/dashboard',
//     component: Dashboard,
//     private: true,
//     roles: [],
//     permissions: [],
//     title: 'Dashboard',
//     icon: '🏠',
//     showInNav: true,
//     navSection: 'main',
//     navOrder: 1,
//   },
//   {
//     path: '/admin/stats',
//     component: AdminStats,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_admin_dashboard', 'view_system_stats'],
//     title: 'Admin Stats',
//     icon: '📊',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 2,
//   },
//   {
//     path: '/admin/schools',
//     component: SchoolList,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_schools'],
//     title: 'Schools',
//     icon: '🏫',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 3,
//   },
//   {
//     path: '/admin/schools/create',
//     component: SchoolForm,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['create_school'],
//     title: 'Add School',
//     icon: '➕',
//     showInNav: false,
//     navSection: 'super_admin',
//     navOrder: 4,
//   },
//   {
//     path: '/admin/schools/edit/:id',
//     component: SchoolForm,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['edit_school'],
//     title: 'Edit School',
//     icon: '✏️',
//     showInNav: false,
//     navSection: 'super_admin',
//     navOrder: 5,
//   },
//   {
//     path: '/admin/subscriptions',
//     component: SchoolSubscription,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_subscriptions'],
//     title: 'Subscriptions',
//     icon: '💳',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 6,
//   },
//   {
//     path: '/admin/users',
//     component: UserList,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_users'],
//     title: 'Users',
//     icon: '👥',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 7,
//   },
//   {
//     path: '/admin/logs',
//     component: ActivityLogs,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['view_activity_logs'],
//     title: 'Activity Logs',
//     icon: '📜',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 8,
//   },
//   {
//     path: '/admin/settings',
//     component: SystemSettings,
//     private: true,
//     roles: ['super_admin'],
//     permissions: ['manage_system_settings'],
//     title: 'System Settings',
//     icon: '⚙️',
//     showInNav: true,
//     navSection: 'super_admin',
//     navOrder: 9,
//   },
//   {
//     path: '/students',
//     component: Students,
//     private: true,
//     roles: ['principal', 'teacher', 'accountant', 'super_admin'],
//     permissions: ['view_students'],
//     title: 'Students',
//     icon: '🎒',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 10,
//   },
//   {
//     path: '/teachers',
//     component: Teachers,
//     private: true,
//     roles: ['principal', 'super_admin'],
//     permissions: ['view_teachers'],
//     title: 'Teachers',
//     icon: '👨‍🏫',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 11,
//   },
//   {
//     path: '/classes',
//     component: Classes,
//     private: true,
//     roles: ['principal', 'teacher', 'super_admin'],
//     permissions: ['view_classes'],
//     title: 'Classes',
//     icon: '🏫',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 12,
//   },
//   {
//     path: '/attendance',
//     component: Attendance,
//     private: true,
//     roles: ['principal', 'teacher', 'student', 'parent', 'super_admin'],
//     permissions: ['view_attendance'],
//     title: 'Attendance',
//     icon: '✅',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 13,
//   },
//   {
//     path: '/assignments',
//     component: Assignments,
//     private: true,
//     roles: ['principal', 'teacher', 'student', 'super_admin'],
//     permissions: ['view_assignments'],
//     title: 'Assignments',
//     icon: '📝',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 14,
//   },
//   {
//     path: '/exams',
//     component: Exams,
//     private: true,
//     roles: ['principal', 'teacher', 'student', 'parent', 'super_admin'],
//     permissions: ['view_exams'],
//     title: 'Exams',
//     icon: '📋',
//     showInNav: true,
//     navSection: 'academic',
//     navOrder: 15,
//   },
//   {
//     path: '/fees',
//     component: Fees,
//     private: true,
//     roles: ['principal', 'accountant', 'student', 'parent', 'super_admin'],
//     permissions: ['view_fees'],
//     title: 'Fees',
//     icon: '💰',
//     showInNav: true,
//     navSection: 'admin',
//     navOrder: 16,
//   },
//   {
//     path: '/notices',
//     component: Notices,
//     private: true,
//     roles: [],
//     permissions: ['view_notices'],
//     title: 'Notices',
//     icon: '📢',
//     showInNav: true,
//     navSection: 'admin',
//     navOrder: 17,
//   },
//   {
//     path: '/timetable',
//     component: Timetable,
//     private: true,
//     roles: [],
//     permissions: ['view_timetable'],
//     title: 'Timetable',
//     icon: '🗓️',
//     showInNav: true,
//     navSection: 'admin',
//     navOrder: 18,
//   },
//   {
//     path: '*',
//     component: NotFound,
//     private: false,
//     roles: [],
//     permissions: [],
//     title: '404 — Not Found',
//     icon: '❓',
//     showInNav: false,
//   },
// ];

// export const NAV_SECTIONS = {
//   main: { label: 'Overview', order: 1 },
//   super_admin: { label: 'Super Admin', order: 2 },
//   academic: { label: 'Academic', order: 3 },
//   admin: { label: 'Management', order: 4 },
// };

// export const getNavRoutes = (userRole, permissions = []) => {
//   return ROUTES
//     .filter((r) => r.showInNav)
//     .filter((r) => {
//       if (r.roles?.length > 0 && !r.roles.includes(userRole)) return false;
//       if (r.permissions?.length > 0 && !r.permissions.some((p) => permissions.includes(p))) return false;
//       return true;
//     })
//     .sort((a, b) => (a.navOrder || 99) - (b.navOrder || 99));
// };

// export const getRouteByPath = (pathname) =>
//   ROUTES.find((r) => r.path === pathname) || null;

// const getCurrentPath = () => {
//   const hash = window.location.hash.replace('#', '') || '/';
//   return hash.startsWith('/') ? hash : '/' + hash;
// };

// const navigate = (to) => {
//   window.location.hash = to;
// };

// const useRouter = () => {
//   const [path, setPath] = React.useState(getCurrentPath);

//   useEffect(() => {
//     const onHashChange = () => setPath(getCurrentPath());
//     window.addEventListener('hashchange', onHashChange);

//     if (!window.location.hash) {
//       window.location.hash = '/login';
//     }

//     return () => window.removeEventListener('hashchange', onHashChange);
//   }, []);

//   return { path, navigate };
// };

// const ProtectedRoute = ({ route, children }) => {
//   const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return <PageLoader />;
//   if (!isAuthenticated) return null;

//   if (route.roles?.length > 0 && !route.roles.some((r) => hasRole(r))) {
//     return <PageLoader />;
//   }

//   if (
//     route.permissions?.length > 0 &&
//     !route.permissions.some((p) => hasPermission(p))
//   ) {
//     return <PageLoader />;
//   }

//   return children;
// };

// const TitleUpdater = ({ title }) => {
//   useEffect(() => {
//     document.title = title
//       ? `${title} — School Management System`
//       : 'School Management System';
//   }, [title]);

//   return null;
// };

// const PublicOnlyRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, loading]);

//   if (loading) return <PageLoader />;
//   if (isAuthenticated) return null;
//   return children;
// };

// const AppRoutes = () => {
//   const { path } = useRouter();
//   const { isAuthenticated } = useAuth();

//   const matchedRoute = React.useMemo(() => {
//     const exact = ROUTES.find((r) => r.path === path);
//     if (exact) return exact;

//     const dynamic = ROUTES.find((r) => {
//       if (!r.path || r.path === '*') return false;

//       const rParts = r.path.split('/');
//       const pParts = path.split('/');

//       if (rParts.length !== pParts.length) return false;

//       return rParts.every((seg, i) => seg.startsWith(':') || seg === pParts[i]);
//     });

//     if (dynamic) return dynamic;

//     const redirect = ROUTES.find((r) => r.redirect && r.path === path);
//     if (redirect) {
//       navigate(redirect.redirect);
//       return null;
//     }

//     return ROUTES.find((r) => r.path === '*') || null;
//   }, [path]);

//   useEffect(() => {
//     if (path === '/') {
//       navigate(isAuthenticated ? '/dashboard' : '/login');
//     }
//   }, [path, isAuthenticated]);

//   if (!matchedRoute) return <PageLoader />;

//   const PageComponent = matchedRoute.component;
//   if (!PageComponent) return <PageLoader />;

//   if (!matchedRoute.private) {
//     if (matchedRoute.path === '/login') {
//       return (
//         <PublicOnlyRoute>
//           <TitleUpdater title={matchedRoute.title} />
//           <Suspense fallback={<PageLoader />}>
//             <PageComponent />
//           </Suspense>
//         </PublicOnlyRoute>
//       );
//     }

//     return (
//       <>
//         <TitleUpdater title={matchedRoute.title} />
//         <Suspense fallback={<PageLoader />}>
//           <PageComponent />
//         </Suspense>
//       </>
//     );
//   }

//   return (
//     <ProtectedRoute route={matchedRoute}>
//       <TitleUpdater title={matchedRoute.title} />
//       <Suspense fallback={<PageLoader />}>
//         <Layout currentPath={path} navigate={navigate}>
//           <PageComponent />
//         </Layout>
//       </Suspense>
//     </ProtectedRoute>
//   );
// };

// export { navigate, useRouter };
// export default AppRoutes;




// src/routes.js

import React, { lazy, useEffect, Suspense } from 'react';
import { useAuth } from './hooks/useAuth';

/* ── Lazy-loaded pages ── */
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Students = lazy(() => import('./pages/Students'));
const Teachers = lazy(() => import('./pages/Teachers'));
const Classes = lazy(() => import('./pages/Classes'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Assignments = lazy(() => import('./pages/Assignments'));
const Exams = lazy(() => import('./pages/Exams'));
const Fees = lazy(() => import('./pages/Fees'));
const Notices = lazy(() => import('./pages/Notices'));
const Timetable = lazy(() => import('./pages/Timetable'));
const NotFound = lazy(() => import('./pages/NotFound'));

/* ── Lazy-loaded admin components ── */
const AdminStats = lazy(() => import('./components/admin/AdminStats'));
const SchoolList = lazy(() => import('./components/admin/SchoolList'));
const SchoolForm = lazy(() => import('./components/admin/SchoolForm'));
const SchoolSubscription = lazy(() => import('./components/admin/SchoolSubscription'));
const UserList = lazy(() => import('./components/admin/UserList'));
const ActivityLogs = lazy(() => import('./components/admin/ActivityLogs'));
const SystemSettings = lazy(() => import('./components/admin/SystemSettings'));

/* ── Lazy-loaded layout ── */
const Layout = lazy(() => import('./components/layout/Layout'));

const PageLoader = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      color: '#64748b',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 14,
    }}
  >
    Loading...
  </div>
);

/* ════════════════════════════════════════════════════════════
   ROUTE DEFINITIONS
══════════════════════════════════════════════════════════════ */

export const ROUTES = [
  {
    path: '/login',
    component: Login,
    private: false,
    roles: [],
    permissions: [],
    title: 'Login',
    icon: '🔐',
    showInNav: false,
  },
  {
    path: '/',
    redirect: '/dashboard',
    private: true,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    private: true,
    roles: [],
    permissions: [],
    title: 'Dashboard',
    icon: '🏠',
    showInNav: true,
    navSection: 'main',
    navOrder: 1,
  },

  /* ── Super Admin ── */
  {
    path: '/admin/stats',
    component: AdminStats,
    private: true,
    roles: ['super_admin'],
    permissions: [],
    title: 'Admin Stats',
    icon: '📊',
    showInNav: true,
    navSection: 'super_admin',
    navOrder: 2,
  },
  {
    path: '/admin/schools',
    component: SchoolList,
    private: true,
    roles: ['super_admin'],
    permissions: [],
    title: 'Schools',
    icon: '🏫',
    showInNav: true,
    navSection: 'super_admin',
    navOrder: 3,
  },
  {
    path: '/admin/schools/create',
    component: SchoolForm,
    private: true,
    roles: ['super_admin'],
    permissions: [],
    title: 'Add School',
    icon: '➕',
    showInNav: false,
    navSection: 'super_admin',
    navOrder: 4,
  },
  {
    path: '/admin/schools/edit/:id',
    component: SchoolForm,
    private: true,
    roles: ['super_admin'],
    permissions: [],
    title: 'Edit School',
    icon: '✏️',
    showInNav: false,
    navSection: 'super_admin',
    navOrder: 5,
  },
  {
    path: '/admin/subscriptions',
    component: SchoolSubscription,
    private: true,
    roles: ['super_admin'],
    permissions: [],
    title: 'Subscriptions',
    icon: '💳',
    showInNav: true,
    navSection: 'super_admin',
    navOrder: 6,
  },
  {
    path: '/admin/users',
    component: UserList,
    private: true,
    roles: ['super_admin'],
    permissions: [],
    title: 'Users',
    icon: '👥',
    showInNav: true,
    navSection: 'super_admin',
    navOrder: 7,
  },
  {
    path: '/admin/logs',
    component: ActivityLogs,
    private: true,
    roles: ['super_admin'],
    permissions: [],
    title: 'Activity Logs',
    icon: '📜',
    showInNav: true,
    navSection: 'super_admin',
    navOrder: 8,
  },
  {
    path: '/admin/settings',
    component: SystemSettings,
    private: true,
    roles: ['super_admin'],
    permissions: [],
    title: 'System Settings',
    icon: '⚙️',
    showInNav: true,
    navSection: 'super_admin',
    navOrder: 9,
  },

  /* ── Academic ── */
  {
    path: '/students',
    component: Students,
    private: true,
    roles: ['principal', 'teacher', 'accountant', 'super_admin'],
    permissions: ['view_students'],
    title: 'Students',
    icon: '🎒',
    showInNav: true,
    navSection: 'academic',
    navOrder: 10,
  },
  {
    path: '/teachers',
    component: Teachers,
    private: true,
    roles: ['principal', 'super_admin'],
    permissions: ['view_teachers'],
    title: 'Teachers',
    icon: '👨‍🏫',
    showInNav: true,
    navSection: 'academic',
    navOrder: 11,
  },
  {
    path: '/classes',
    component: Classes,
    private: true,
    roles: ['principal', 'teacher', 'super_admin'],
    permissions: ['view_classes'],
    title: 'Classes',
    icon: '🏫',
    showInNav: true,
    navSection: 'academic',
    navOrder: 12,
  },
  {
    path: '/attendance',
    component: Attendance,
    private: true,
    roles: ['principal', 'teacher', 'student', 'parent', 'super_admin'],
    permissions: ['view_attendance'],
    title: 'Attendance',
    icon: '✅',
    showInNav: true,
    navSection: 'academic',
    navOrder: 13,
  },
  {
    path: '/assignments',
    component: Assignments,
    private: true,
    roles: ['principal', 'teacher', 'student', 'super_admin'],
    permissions: ['view_assignments'],
    title: 'Assignments',
    icon: '📝',
    showInNav: true,
    navSection: 'academic',
    navOrder: 14,
  },
  {
    path: '/exams',
    component: Exams,
    private: true,
    roles: ['principal', 'teacher', 'student', 'parent', 'super_admin'],
    permissions: ['view_exams'],
    title: 'Exams',
    icon: '📋',
    showInNav: true,
    navSection: 'academic',
    navOrder: 15,
  },

  /* ── Management ── */
  {
    path: '/fees',
    component: Fees,
    private: true,
    roles: ['principal', 'accountant', 'student', 'parent', 'super_admin'],
    permissions: ['view_fees'],
    title: 'Fees',
    icon: '💰',
    showInNav: true,
    navSection: 'admin',
    navOrder: 16,
  },
  {
    path: '/notices',
    component: Notices,
    private: true,
    roles: [],
    permissions: ['view_notices'],
    title: 'Notices',
    icon: '📢',
    showInNav: true,
    navSection: 'admin',
    navOrder: 17,
  },
  {
    path: '/timetable',
    component: Timetable,
    private: true,
    roles: [],
    permissions: ['view_timetable'],
    title: 'Timetable',
    icon: '🗓️',
    showInNav: true,
    navSection: 'admin',
    navOrder: 18,
  },

  {
    path: '*',
    component: NotFound,
    private: false,
    roles: [],
    permissions: [],
    title: '404 — Not Found',
    icon: '❓',
    showInNav: false,
  },
];

export const NAV_SECTIONS = {
  main: { label: 'Overview', order: 1 },
  super_admin: { label: 'Super Admin', order: 2 },
  academic: { label: 'Academic', order: 3 },
  admin: { label: 'Management', order: 4 },
};

/* ════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

export const getNavRoutes = (userRole, permissions = []) => {
  return ROUTES
    .filter((r) => r.showInNav)
    .filter((r) => {
      if (r.roles?.length > 0 && !r.roles.includes(userRole)) return false;
      if (r.permissions?.length > 0 && !r.permissions.some((p) => permissions.includes(p))) return false;
      return true;
    })
    .sort((a, b) => (a.navOrder || 99) - (b.navOrder || 99));
};

export const getRouteByPath = (pathname) => {
  const exact = ROUTES.find((r) => r.path === pathname);
  if (exact) return exact;

  return (
    ROUTES.find((r) => {
      if (!r.path || r.path === '*' || !r.path.includes(':')) return false;

      const routeParts = r.path.split('/');
      const pathParts = pathname.split('/');

      if (routeParts.length !== pathParts.length) return false;

      return routeParts.every((part, index) => {
        return part.startsWith(':') || part === pathParts[index];
      });
    }) || null
  );
};

const getCurrentPath = () => {
  const hash = window.location.hash.replace('#', '') || '/';
  return hash.startsWith('/') ? hash : `/${hash}`;
};

const navigate = (to) => {
  window.location.hash = to;
};

const useRouter = () => {
  const [path, setPath] = React.useState(getCurrentPath());

  useEffect(() => {
    const onHashChange = () => setPath(getCurrentPath());

    window.addEventListener('hashchange', onHashChange);

    if (!window.location.hash) {
      window.location.hash = '/login';
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return { path, navigate };
};

/* ════════════════════════════════════════════════════════════
   ROUTE GUARDS
══════════════════════════════════════════════════════════════ */

const ProtectedRoute = ({ route, children }) => {
  const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading]);

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return null;

  if (route.roles?.length > 0 && !route.roles.some((r) => hasRole(r))) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 52 }}>🚫</div>
        <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Access Denied</h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          You don&apos;t have permission to view this page.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop: 8,
            padding: '10px 24px',
            background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🏠 Go to Dashboard
        </button>
      </div>
    );
  }

  if (
    route.permissions?.length > 0 &&
    !route.permissions.some((p) => hasPermission(p))
  ) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 52 }}>🔒</div>
        <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Insufficient Permissions</h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          You don&apos;t have the required permissions for this section.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop: 8,
            padding: '10px 24px',
            background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🏠 Go to Dashboard
        </button>
      </div>
    );
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading]);

  if (loading) return <PageLoader />;
  if (isAuthenticated) return null;

  return children;
};

const TitleUpdater = ({ title }) => {
  useEffect(() => {
    document.title = title
      ? `${title} — School Management System`
      : 'School Management System';
  }, [title]);

  return null;
};

/* ════════════════════════════════════════════════════════════
   MAIN ROUTER COMPONENT
══════════════════════════════════════════════════════════════ */

const AppRoutes = () => {
  const { path } = useRouter();
  const { isAuthenticated } = useAuth();

  const matchedRoute = React.useMemo(() => {
    if (path === '/') {
      return ROUTES.find((r) => r.path === '/');
    }

    return getRouteByPath(path) || ROUTES.find((r) => r.path === '*') || null;
  }, [path]);

  useEffect(() => {
    if (path === '/') {
      navigate(isAuthenticated ? '/dashboard' : '/login');
    }
  }, [path, isAuthenticated]);

  if (!matchedRoute) {
    return <PageLoader />;
  }

  if (matchedRoute.redirect) {
    return <PageLoader />;
  }

  const PageComponent = matchedRoute.component;

  if (!PageComponent) {
    return <PageLoader />;
  }

  if (!matchedRoute.private) {
    if (matchedRoute.path === '/login') {
      return (
        <PublicOnlyRoute>
          <TitleUpdater title={matchedRoute.title} />
          <Suspense fallback={<PageLoader />}>
            <PageComponent />
          </Suspense>
        </PublicOnlyRoute>
      );
    }

    return (
      <>
        <TitleUpdater title={matchedRoute.title} />
        <Suspense fallback={<PageLoader />}>
          <PageComponent />
        </Suspense>
      </>
    );
  }

  return (
    <ProtectedRoute route={matchedRoute}>
      <TitleUpdater title={matchedRoute.title} />
      <Suspense fallback={<PageLoader />}>
        <Layout currentPath={path} navigate={navigate}>
          <PageComponent />
        </Layout>
      </Suspense>
    </ProtectedRoute>
  );
};

export { navigate, useRouter };
export default AppRoutes;