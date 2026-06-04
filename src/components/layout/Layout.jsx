// import React, { useState, useEffect } from 'react';
// import Sidebar from './Sidebar';
// import Topbar from './Topbar';

// const Layout = ({
//   children,
//   activePage,
//   onNavigate,
//   user,
//   userRole,
//   onLogout,
// }) => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen]             = useState(false);
//   const [isMobile, setIsMobile]                 = useState(window.innerWidth < 768);

//   /* ─── responsive detection ────────────────────────────── */
//   useEffect(() => {
//     const handler = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (!mobile) setMobileOpen(false);
//     };
//     window.addEventListener('resize', handler);
//     return () => window.removeEventListener('resize', handler);
//   }, []);

//   /* ─── close mobile sidebar on navigate ───────────────── */
//   useEffect(() => {
//     if (isMobile) setMobileOpen(false);
//   }, [activePage]);

//   const handleToggle = () => {
//     if (isMobile) setMobileOpen((p) => !p);
//     else          setSidebarCollapsed((p) => !p);
//   };

//   /* ─── render ─────────────────────────────────────────── */
//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

//       {/* ── Mobile overlay backdrop ── */}
//       {isMobile && mobileOpen && (
//         <div
//           onClick={() => setMobileOpen(false)}
//           style={{
//             position  : 'fixed', inset: 0,
//             background: 'rgba(15,23,42,0.6)',
//             zIndex    : 998,
//             backdropFilter: 'blur(2px)',
//           }}
//         />
//       )}

//       {/* ── Sidebar ── */}
//       <div style={{
//         position  : isMobile ? 'fixed' : 'sticky',
//         top       : 0,
//         left      : 0,
//         height    : isMobile ? '100vh' : undefined,
//         zIndex    : isMobile ? 999 : 10,
//         transform : isMobile
//           ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)')
//           : 'none',
//         transition: 'transform 0.25s ease',
//       }}>
//         <Sidebar
//           activePage={activePage}
//           onNavigate={onNavigate}
//           userRole={userRole}
//           collapsed={isMobile ? false : sidebarCollapsed}
//           onToggle={handleToggle}
//         />
//       </div>

//       {/* ── Main content area ── */}
//       <div style={{
//         flex        : 1,
//         display     : 'flex',
//         flexDirection: 'column',
//         minWidth    : 0,
//         minHeight   : '100vh',
//       }}>
//         {/* Topbar */}
//         <Topbar
//           activePage={activePage}
//           user={user}
//           userRole={userRole}
//           onLogout={onLogout}
//           onToggleSidebar={handleToggle}
//           sidebarCollapsed={isMobile ? !mobileOpen : sidebarCollapsed}
//         />

//         {/* Page content */}
//         <main style={{
//           flex      : 1,
//           padding   : '28px 28px',
//           overflowY : 'auto',
//         }}>
//           {/* Breadcrumb */}
//           <Breadcrumb activePage={activePage} onNavigate={onNavigate} />

//           {/* Page wrapper */}
//           <div style={{
//             maxWidth  : 1400,
//             margin    : '0 auto',
//             animation : 'fadeIn 0.2s ease',
//           }}>
//             {children}
//           </div>
//         </main>

//         {/* Footer */}
//         <footer style={{
//           padding       : '14px 28px',
//           borderTop     : '1px solid #f1f5f9',
//           background    : 'white',
//           display       : 'flex',
//           justifyContent: 'space-between',
//           alignItems    : 'center',
//           flexWrap      : 'wrap',
//           gap           : 8,
//         }}>
//           <span style={{ fontSize: 12, color: '#94a3b8' }}>
//             © {new Date().getFullYear()} EduManage. All rights reserved.
//           </span>
//           <div style={{ display: 'flex', gap: 16 }}>
//             {['Privacy Policy', 'Terms of Use', 'Help'].map((l) => (
//               <button
//                 key={l}
//                 style={{
//                   background : 'none', border: 'none',
//                   fontSize   : 12, color: '#94a3b8',
//                   cursor     : 'pointer',
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
//               >
//                 {l}
//               </button>
//             ))}
//           </div>
//         </footer>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(6px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }

//         * { box-sizing: border-box; }

//         ::-webkit-scrollbar        { width: 5px; height: 5px; }
//         ::-webkit-scrollbar-track  { background: #f1f5f9; }
//         ::-webkit-scrollbar-thumb  { background: #cbd5e1; border-radius: 99px; }
//         ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

//         @media (max-width: 768px) {
//           main { padding: 16px !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// /* ─── Breadcrumb sub-component ────────────────────────────── */
// const BREADCRUMB_MAP = {
//   dashboard   : [{ label: 'Dashboard' }],
//   students    : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Students' }],
//   teachers    : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Teachers' }],
//   classes     : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Classes'  }],
//   subjects    : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Subjects' }],
//   timetable   : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Timetable'}],
//   attendance  : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Attendance'}],
//   assignments : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Assignments'}],
//   exams       : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Exams'    }],
//   fees        : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Fees'     }],
//   notices     : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Notices'  }],
// };

// const Breadcrumb = ({ activePage, onNavigate }) => {
//   const crumbs = BREADCRUMB_MAP[activePage] || [{ label: activePage }];
//   if (crumbs.length <= 1) return null;

//   return (
//     <nav style={{
//       display    : 'flex', alignItems: 'center', gap: 6,
//       marginBottom: 20, fontSize: 13,
//     }}>
//       {crumbs.map((crumb, idx) => {
//         const isLast = idx === crumbs.length - 1;
//         return (
//           <React.Fragment key={idx}>
//             {idx > 0 && (
//               <span style={{ color: '#cbd5e1', fontSize: 11 }}>›</span>
//             )}
//             {crumb.key && !isLast ? (
//               <button
//                 onClick={() => onNavigate(crumb.key)}
//                 style={{
//                   background : 'none', border: 'none',
//                   color      : '#64748b', cursor: 'pointer',
//                   fontSize   : 13, padding: 0, fontWeight: 500,
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
//               >
//                 {crumb.label}
//               </button>
//             ) : (
//               <span style={{
//                 color      : isLast ? '#0f172a' : '#64748b',
//                 fontWeight : isLast ? 700 : 500,
//               }}>
//                 {crumb.label}
//               </span>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </nav>
//   );
// };

// export default Layout;



// // Code Change 


// //src/components/layout/Layout.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import Sidebar from './Sidebar';
// import Topbar  from './Topbar';

// const Layout = ({ children, currentPath, navigate }) => {
//   const { user, userRole, logout } = useAuth();
  
//   const [mobileOpen, setMobileOpen]     = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

//   // Determine active page from path
//   const activePage = currentPath?.split('/')[1] || 'dashboard';

//   const handleToggle = () => {
//     if (isMobile) setMobileOpen((p) => !p);
//     else          setSidebarCollapsed((p) => !p);
//   };

//   const onNavigate = (to) => {
//     if (navigate) navigate(to);
//     if (isMobile) setMobileOpen(false);
//   };

//   const onLogout = async () => {
//     try { await logout(); } catch (e) {}
//     window.location.hash = '/login';
//   };

//   /* ── Responsive listener ─────────────────────────────── */
//   useEffect(() => {
//     const handler = () => {
//       if (window.innerWidth >= 768) setMobileOpen(false);
//     };
//     window.addEventListener('resize', handler);
//     return () => window.removeEventListener('resize', handler);
//   }, []);

//   /* ── close mobile sidebar on navigate ────────────────── */
//   useEffect(() => {
//     if (isMobile) setMobileOpen(false);
//   }, [currentPath, isMobile]);

//   /* ─── render ─────────────────────────────────────────── */
//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

//       {/* ── Mobile overlay backdrop ── */}
//       {isMobile && mobileOpen && (
//         <div
//           onClick={() => setMobileOpen(false)}
//           style={{
//             position  : 'fixed', inset: 0,
//             background: 'rgba(15,23,42,0.6)',
//             zIndex    : 998,
//             backdropFilter: 'blur(2px)',
//           }}
//         />
//       )}

//       {/* ── Sidebar ── */}
//       <div style={{
//         position  : isMobile ? 'fixed' : 'sticky',
//         top       : 0,
//         left      : 0,
//         height    : isMobile ? '100vh' : undefined,
//         zIndex    : isMobile ? 999 : 10,
//         transform : isMobile
//           ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)')
//           : 'none',
//         transition: 'transform 0.25s ease',
//       }}>
//         <Sidebar
//           activePage={activePage}
//           onNavigate={onNavigate}
//           userRole={userRole}
//           collapsed={isMobile ? false : sidebarCollapsed}
//           onToggle={handleToggle}
//         />
//       </div>

//       {/* ── Main content area ── */}
//       <div style={{
//         flex        : 1,
//         display     : 'flex',
//         flexDirection: 'column',
//         minWidth    : 0,
//         minHeight   : '100vh',
//       }}>
//         {/* Topbar */}
//         <Topbar
//           activePage={activePage}
//           user={user}
//           userRole={userRole}
//           onLogout={onLogout}
//           onToggleSidebar={handleToggle}
//           sidebarCollapsed={isMobile ? !mobileOpen : sidebarCollapsed}
//         />

//         {/* Page content */}
//         <main style={{
//           flex      : 1,
//           padding   : '28px 28px',
//           overflowY : 'auto',
//         }}>
//           {/* Breadcrumb */}
//           <Breadcrumb activePage={activePage} onNavigate={onNavigate} />

//           {/* Page wrapper */}
//           <div style={{
//             maxWidth  : 1400,
//             margin    : '0 auto',
//             animation : 'fadeIn 0.2s ease',
//           }}>
//             {children}
//           </div>
//         </main>

//         {/* Footer */}
//         <footer style={{
//           padding       : '14px 28px',
//           borderTop     : '1px solid #f1f5f9',
//           background    : 'white',
//           display       : 'flex',
//           justifyContent: 'space-between',
//           alignItems    : 'center',
//           flexWrap      : 'wrap',
//           gap           : 8,
//         }}>
//           <span style={{ fontSize: 12, color: '#94a3b8' }}>
//             © {new Date().getFullYear()} EduManage. All rights reserved.
//           </span>
//           <div style={{ display: 'flex', gap: 16 }}>
//             {['Privacy Policy', 'Terms of Use', 'Help'].map((l) => (
//               <button
//                 key={l}
//                 style={{
//                   background : 'none', border: 'none',
//                   fontSize   : 12, color: '#94a3b8',
//                   cursor     : 'pointer',
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
//               >
//                 {l}
//               </button>
//             ))}
//           </div>
//         </footer>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(6px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// /* ─── Breadcrumb Helper ─────────────────────────────────── */
// const BREADCRUMB_MAP = {
//   dashboard   : [{ label: 'Dashboard' }],
//   students    : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Students' }],
//   teachers    : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Teachers' }],
//   classes     : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Classes'  }],
//   subjects    : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Subjects' }],
//   timetable   : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Timetable'}],
//   attendance  : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Attendance'}],
//   assignments : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Assignments'}],
//   exams       : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Exams'    }],
//   fees        : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Fees'     }],
//   notices     : [{ label: 'Dashboard', key: 'dashboard' }, { label: 'Notices'  }],
// };

// const Breadcrumb = ({ activePage, onNavigate }) => {
//   const crumbs = BREADCRUMB_MAP[activePage] || [{ label: activePage }];
//   if (crumbs.length <= 1) return null;

//   return (
//     <nav style={{
//       display    : 'flex', alignItems: 'center', gap: 6,
//       marginBottom: 20, fontSize: 13,
//     }}>
//       {crumbs.map((crumb, idx) => {
//         const isLast = idx === crumbs.length - 1;
//         return (
//           <React.Fragment key={idx}>
//             {idx > 0 && (
//               <span style={{ color: '#cbd5e1', fontSize: 11 }}>›</span>
//             )}
//             {crumb.key && !isLast ? (
//               <button
//                 onClick={() => onNavigate(crumb.key)}
//                 style={{
//                   background : 'none', border: 'none',
//                   color      : '#64748b', cursor: 'pointer',
//                   fontSize   : 13, padding: 0, fontWeight: 500,
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
//               >
//                 {crumb.label}
//               </button>
//             ) : (
//               <span style={{
//                 color      : isLast ? '#0f172a' : '#64748b',
//                 fontWeight : isLast ? 700 : 500,
//               }}>
//                 {crumb.label}
//               </span>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </nav>
//   );
// };

// // FIX: Added Default Export to match the lazy import in routes.js
// export default Layout;


// // src/components/layout/Layout.jsx
// import React, { useState, useEffect, useMemo } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import Sidebar from './Sidebar';
// import Topbar from './Topbar';

// const getPageKeyFromPath = (path = '/dashboard') => {
//   if (!path || path === '/') return 'dashboard';

//   if (path.startsWith('/admin/stats')) return 'admin-stats';
//   if (path.startsWith('/admin/schools')) return 'admin-schools';
//   if (path.startsWith('/admin/subscriptions')) return 'admin-subscriptions';
//   if (path.startsWith('/admin/users')) return 'admin-users';
//   if (path.startsWith('/admin/logs')) return 'admin-logs';
//   if (path.startsWith('/admin/settings')) return 'admin-settings';

//   return path.split('/')[1] || 'dashboard';
// };

// const Layout = ({ children, currentPath, navigate }) => {
//   const { user, userRole, logout } = useAuth();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(
//     typeof window !== 'undefined' ? window.innerWidth < 768 : false
//   );

//   const activePath = currentPath || '/dashboard';
//   const activePage = useMemo(() => getPageKeyFromPath(activePath), [activePath]);

//   const handleToggle = () => {
//     if (isMobile) setMobileOpen((p) => !p);
//     else setSidebarCollapsed((p) => !p);
//   };

//   const onNavigate = (to) => {
//     if (!to) return;
//     if (navigate) navigate(to);
//     if (isMobile) setMobileOpen(false);
//   };

//   const onLogout = async () => {
//     try {
//       await logout();
//     } catch (e) {}
//     window.location.hash = '/login';
//   };

//   useEffect(() => {
//     const handler = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (!mobile) setMobileOpen(false);
//     };

//     window.addEventListener('resize', handler);
//     return () => window.removeEventListener('resize', handler);
//   }, []);

//   useEffect(() => {
//     if (isMobile) setMobileOpen(false);
//   }, [activePath, isMobile]);

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
//       {isMobile && mobileOpen && (
//         <div
//           onClick={() => setMobileOpen(false)}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             background: 'rgba(15,23,42,0.6)',
//             zIndex: 998,
//             backdropFilter: 'blur(2px)',
//           }}
//         />
//       )}

//       <div
//         style={{
//           position: isMobile ? 'fixed' : 'sticky',
//           top: 0,
//           left: 0,
//           height: isMobile ? '100vh' : undefined,
//           zIndex: isMobile ? 999 : 10,
//           transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
//           transition: 'transform 0.25s ease',
//         }}
//       >
//         <Sidebar
//           activePage={activePath}
//           onNavigate={onNavigate}
//           collapsed={isMobile ? false : sidebarCollapsed}
//           onToggle={handleToggle}
//         />
//       </div>

//       <div
//         style={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           minWidth: 0,
//           minHeight: '100vh',
//         }}
//       >
//         <Topbar
//           activePage={activePage}
//           currentPath={activePath}
//           user={user}
//           userRole={userRole}
//           onLogout={onLogout}
//           onToggleSidebar={handleToggle}
//           sidebarCollapsed={isMobile ? !mobileOpen : sidebarCollapsed}
//         />

//         <main
//           style={{
//             flex: 1,
//             padding: '28px 28px',
//             overflowY: 'auto',
//           }}
//         >
//           <Breadcrumb activePage={activePage} onNavigate={onNavigate} />

//           <div
//             style={{
//               maxWidth: 1400,
//               margin: '0 auto',
//               animation: 'fadeIn 0.2s ease',
//             }}
//           >
//             {children}
//           </div>
//         </main>

//         <footer
//           style={{
//             padding: '14px 28px',
//             borderTop: '1px solid #f1f5f9',
//             background: 'white',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             gap: 8,
//           }}
//         >
//           <span style={{ fontSize: 12, color: '#94a3b8' }}>
//             © {new Date().getFullYear()} EduManage. All rights reserved.
//           </span>

//           <div style={{ display: 'flex', gap: 16 }}>
//             {['Privacy Policy', 'Terms of Use', 'Help'].map((l) => (
//               <button
//                 key={l}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   fontSize: 12,
//                   color: '#94a3b8',
//                   cursor: 'pointer',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
//                 onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
//               >
//                 {l}
//               </button>
//             ))}
//           </div>
//         </footer>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(6px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// const BREADCRUMB_MAP = {
//   dashboard: [{ label: 'Dashboard', path: '/dashboard' }],
//   students: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Students' }],
//   teachers: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Teachers' }],
//   classes: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Classes' }],
//   subjects: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Subjects' }],
//   timetable: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Timetable' }],
//   attendance: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Attendance' }],
//   assignments: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Assignments' }],
//   exams: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Exams' }],
//   fees: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Fees' }],
//   notices: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Notices' }],
//   'admin-stats': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Admin Stats' }],
//   'admin-schools': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Schools' }],
//   'admin-subscriptions': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Subscriptions' }],
//   'admin-users': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Users' }],
//   'admin-logs': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Activity Logs' }],
//   'admin-settings': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'System Settings' }],
// };

// const Breadcrumb = ({ activePage, onNavigate }) => {
//   const crumbs = BREADCRUMB_MAP[activePage] || [{ label: activePage }];

//   if (crumbs.length <= 1) return null;

//   return (
//     <nav
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: 6,
//         marginBottom: 20,
//         fontSize: 13,
//       }}
//     >
//       {crumbs.map((crumb, idx) => {
//         const isLast = idx === crumbs.length - 1;

//         return (
//           <React.Fragment key={idx}>
//             {idx > 0 && <span style={{ color: '#cbd5e1', fontSize: 11 }}>›</span>}

//             {crumb.path && !isLast ? (
//               <button
//                 onClick={() => onNavigate(crumb.path)}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: '#64748b',
//                   cursor: 'pointer',
//                   fontSize: 13,
//                   padding: 0,
//                   fontWeight: 500,
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
//                 onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
//               >
//                 {crumb.label}
//               </button>
//             ) : (
//               <span
//                 style={{
//                   color: isLast ? '#0f172a' : '#64748b',
//                   fontWeight: isLast ? 700 : 500,
//                   textTransform: 'capitalize',
//                 }}
//               >
//                 {crumb.label}
//               </span>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </nav>
//   );
// };

// export default Layout;

// src/components/layout/Layout.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'; // ADDED REACT ROUTER HOOKS
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const getPageKeyFromPath = (path = '/dashboard') => {
  if (!path || path === '/') return 'dashboard';

  if (path.startsWith('/admin/stats')) return 'admin-stats';
  if (path.startsWith('/admin/schools')) return 'admin-schools';
  if (path.startsWith('/admin/subscriptions')) return 'admin-subscriptions';
  if (path.startsWith('/admin/users')) return 'admin-users';
  if (path.startsWith('/admin/logs')) return 'admin-logs';
  if (path.startsWith('/admin/settings')) return 'admin-settings';

  return path.split('/')[1] || 'dashboard';
};

const Layout = () => { // REMOVED props, using React Router instead
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate(); // ADDED
  const location = useLocation(); // ADDED

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // FIX: Get path directly from React Router
  const activePath = location.pathname;
  const activePage = useMemo(() => getPageKeyFromPath(activePath), [activePath]);

  const handleToggle = () => {
    if (isMobile) setMobileOpen((p) => !p);
    else setSidebarCollapsed((p) => !p);
  };

  // FIX: Actually navigate using React Router
  const onNavigate = (to) => {
    if (!to) return;
    navigate(to); 
    if (isMobile) setMobileOpen(false);
  };

  const onLogout = async () => {
    try {
      await logout();
    } catch (e) {}
    navigate('/login'); // FIX: Use navigate instead of window.location.hash
  };

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [activePath, isMobile]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            zIndex: 998,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <div
        style={{
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: isMobile ? '100vh' : undefined,
          zIndex: isMobile ? 999 : 10,
          transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'transform 0.25s ease',
        }}
      >
        <Sidebar
          activePage={activePath}
          onNavigate={onNavigate}
          collapsed={isMobile ? false : sidebarCollapsed}
          onToggle={handleToggle}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        <Topbar
          activePage={activePage}
          currentPath={activePath}
          user={user}
          userRole={userRole}
          onLogout={onLogout}
          onToggleSidebar={handleToggle}
          sidebarCollapsed={isMobile ? !mobileOpen : sidebarCollapsed}
        />

        <main
          style={{
            flex: 1,
            padding: '28px 28px',
            overflowY: 'auto',
          }}
        >
          <Breadcrumb activePage={activePage} onNavigate={onNavigate} />

          <div
            style={{
              maxWidth: 1400,
              margin: '0 auto',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {/* FIX: Replaced {children} with <Outlet /> to render React Router pages */}
            <Outlet /> 
          </div>
        </main>

        <footer
          style={{
            padding: '14px 28px',
            borderTop: '1px solid #f1f5f9',
            background: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            © {new Date().getFullYear()} EduManage. All rights reserved.
          </span>

          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy Policy', 'Terms of Use', 'Help'].map((l) => (
              <button
                key={l}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 12,
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                {l}
              </button>
            ))}
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const BREADCRUMB_MAP = {
  dashboard: [{ label: 'Dashboard', path: '/dashboard' }],
  students: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Students' }],
  teachers: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Teachers' }],
  classes: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Classes' }],
  subjects: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Subjects' }],
  timetable: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Timetable' }],
  attendance: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Attendance' }],
  assignments: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Assignments' }],
  exams: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Exams' }],
  fees: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Fees' }],
  notices: [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Notices' }],
  'admin-stats': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Admin Stats' }],
  'admin-schools': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Schools' }],
  'admin-subscriptions': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Subscriptions' }],
  'admin-users': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Users' }],
  'admin-logs': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Activity Logs' }],
  'admin-settings': [{ label: 'Dashboard', path: '/dashboard' }, { label: 'System Settings' }],
};

const Breadcrumb = ({ activePage, onNavigate }) => {
  const crumbs = BREADCRUMB_MAP[activePage] || [{ label: activePage }];

  if (crumbs.length <= 1) return null;

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
        fontSize: 13,
      }}
    >
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span style={{ color: '#cbd5e1', fontSize: 11 }}>›</span>}

            {crumb.path && !isLast ? (
              <button
                onClick={() => onNavigate(crumb.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: 13,
                  padding: 0,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                {crumb.label}
              </button>
            ) : (
              <span
                style={{
                  color: isLast ? '#0f172a' : '#64748b',
                  fontWeight: isLast ? 700 : 500,
                  textTransform: 'capitalize',
                }}
              >
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Layout;