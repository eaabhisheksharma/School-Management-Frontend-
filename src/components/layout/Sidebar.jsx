// //src/components/layout/Sidebar.jsx

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';

// /**
//  * Sidebar Component
//  * Handles navigation and menu rendering based on user role.
//  */
// const Sidebar = ({ activePage, onNavigate, collapsed, onToggle }) => {
//   const { userRole, isSuperAdmin, userName, userAvatar } = useAuth();
//   const [hovered, setHovered] = useState(null);

//   // Define navigation items based on role
//   const getNavItems = () => {
//     const items = [];

//     // 1. Main Section
//     items.push({ section: 'main', label: 'Overview', order: 1 });

//     items.push({
//       id: 'dashboard',
//       label: 'Dashboard',
//       icon: '🏠',
//       path: '/dashboard',
//       section: 'main',
//       order: 1,
//     });

//     // 2. Super Admin Section
//     if (isSuperAdmin) {
//       items.push({ section: 'superadmin', label: 'Administration', order: 2 });
      
//       items.push({
//         id: 'schools',
//         label: 'Manage Schools',
//         icon: '🏛️',
//         path: '/schools', // You might need to create this page later
//         section: 'superadmin',
//         order: 1,
//       });
      
//       items.push({
//         id: 'users',
//         label: 'Platform Users',
//         icon: '👥',
//         path: '/users', // You might need to create this page later
//         section: 'superadmin',
//         order: 2,
//       });
//     }

//     // 3. Academic Section (Principal/Teacher)
//     if (['principal', 'teacher', 'super_admin'].includes(userRole)) {
//       items.push({ section: 'academic', label: 'Academic', order: 3 });

//       if (['principal', 'super_admin'].includes(userRole)) {
//         items.push({
//           id: 'students',
//           label: 'Students',
//           icon: '🎒',
//           path: '/students',
//           section: 'academic',
//           order: 1,
//         });
//       }

//       if (['principal', 'super_admin'].includes(userRole)) {
//         items.push({
//           id: 'teachers',
//           label: 'Teachers',
//           icon: '👨‍🏫',
//           path: '/teachers',
//           section: 'academic',
//           order: 2,
//         });
//       }

//       items.push({
//         id: 'classes',
//         label: 'Classes',
//         icon: '🏫',
//         path: '/classes',
//         section: 'academic',
//         order: 3,
//       });

//       items.push({
//         id: 'attendance',
//         label: 'Attendance',
//         icon: '✅',
//         path: '/attendance',
//         section: 'academic',
//         order: 4,
//       });

//       items.push({
//         id: 'assignments',
//         label: 'Assignments',
//         icon: '📝',
//         path: '/assignments',
//         section: 'academic',
//         order: 5,
//       });

//       items.push({
//         id: 'exams',
//         label: 'Exams',
//         icon: '📋',
//         path: '/exams',
//         section: 'academic',
//         order: 6,
//       });
//     }

//     // 4. Management Section
//     if (['principal', 'accountant', 'super_admin'].includes(userRole)) {
//       items.push({ section: 'admin', label: 'Management', order: 4 });

//       items.push({
//         id: 'fees',
//         label: 'Fees',
//         icon: '💰',
//         path: '/fees',
//         section: 'admin',
//         order: 1,
//       });
//     }

//     // Common items for all roles
//     items.push({ section: 'resources', label: 'Resources', order: 5 });
    
//     items.push({
//       id: 'notices',
//       label: 'Notices',
//       icon: '📢',
//       path: '/notices',
//       section: 'resources',
//       order: 1,
//     });

//     items.push({
//       id: 'timetable',
//       label: 'Timetable',
//       icon: '🗓️',
//       path: '/timetable',
//       section: 'resources',
//       order: 2,
//     });

//     // Sort items within sections
//     return items.sort((a, b) => (a.order || 99) - (b.order || 99));
//   };

//   const navItems = getNavItems();

//   const handleNavClick = (path) => {
//     if (onNavigate) onNavigate(path);
//   };

//   /* ─── Styles ─────────────────────────────────────────── */
//   const containerStyle = {
//     width: collapsed ? 72 : 240,
//     height: '100vh',
//     background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
//     color: '#e2e8f0',
//     display: 'flex',
//     flexDirection: 'column',
//     transition: 'width 0.2s ease',
//     overflowX: 'hidden',
//     position: 'relative',
//   };

//   const menuItemStyle = (isActive, isSection) => ({
//     display: 'flex',
//     alignItems: 'center',
//     gap: collapsed ? 0 : 10,
//     padding: collapsed ? '14px 0' : '12px 16px',
//     margin: isSection ? '16px 8px 4px 8px' : '2px 8px',
//     borderRadius: 10,
//     cursor: isSection ? 'default' : 'pointer',
//     background: isActive ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
//     color: isActive ? '#60a5fa' : '#cbd5e1',
//     fontWeight: isActive ? 700 : 500,
//     fontSize: isSection ? 11 : 13,
//     textTransform: isSection ? 'uppercase' : 'none',
//     letterSpacing: isSection ? 0.8 : 0,
//     transition: 'all 0.15s',
//     justifyContent: collapsed && !isSection ? 'center' : 'flex-start',
//     opacity: isSection ? 0.6 : 1,
//   });

//   return (
//     <div style={containerStyle}>
//       {/* ── Header / Logo ── */}
//       <div style={{
//         padding: collapsed ? '20px 0' : '20px 16px',
//         borderBottom: '1px solid rgba(255,255,255,0.1)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: collapsed ? 'center' : 'flex-start',
//         gap: 12,
//       }}>
//         <div style={{
//           width: 36, height: 36,
//           borderRadius: 10,
//           background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           fontSize: 18, flexShrink: 0,
//         }}>
//           🏫
//         </div>
//         {!collapsed && (
//           <div style={{ overflow: 'hidden' }}>
//             <div style={{ fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap' }}>
//               EduManage
//             </div>
//             <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>
//               School System
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── Navigation List ── */}
//       <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
//         {navItems.map((item, index) => {
//           const isSection = !!item.label && !item.icon;
//           const isActive = activePage === item.id;

//           if (isSection) {
//             return (
//               <div key={`sec-${index}`} style={menuItemStyle(false, true)}>
//                 {!collapsed && item.label}
//               </div>
//             );
//           }

//           return (
//             <div
//               key={item.id}
//               onClick={() => handleNavClick(item.path)}
//               style={menuItemStyle(isActive, false)}
//               onMouseEnter={() => setHovered(item.id)}
//               onMouseLeave={() => setHovered(null)}
//             >
//               <span style={{ fontSize: 16, width: collapsed ? 24 : 'auto', textAlign: 'center' }}>
//                 {item.icon}
//               </span>
//               {!collapsed && (
//                 <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
//               )}
              
//               {/* Tooltip for collapsed mode */}
//               {collapsed && hovered === item.id && (
//                 <div style={{
//                   position: 'absolute',
//                   left: 72,
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   background: '#1e293b',
//                   padding: '6px 12px',
//                   borderRadius: 6,
//                   fontSize: 12,
//                   whiteSpace: 'nowrap',
//                   zIndex: 100,
//                   border: '1px solid rgba(255,255,255,0.1)',
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
//                 }}>
//                   {item.label}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* ── User Profile Section ── */}
//       <div style={{
//         padding: collapsed ? '14px 0' : '14px 16px',
//         borderTop: '1px solid rgba(255,255,255,0.1)',
//         display: 'flex',
//         alignItems: 'center',
//         gap: collapsed ? 0 : 10,
//         justifyContent: collapsed ? 'center' : 'flex-start',
//         cursor: 'pointer',
//         transition: 'background 0.15s',
//       }}
//         onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
//         onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//       >
//         <div style={{
//           width: 32, height: 32,
//           borderRadius: '50%',
//           background: isSuperAdmin 
//             ? 'linear-gradient(135deg, #be123c, #9f1239)' 
//             : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
//         }}>
//           {userName ? userName.charAt(0).toUpperCase() : 'U'}
//         </div>
//         {!collapsed && (
//           <div style={{ overflow: 'hidden', flex: 1 }}>
//             <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//               {userName || 'User'}
//             </div>
//             <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'capitalize' }}>
//               {isSuperAdmin ? 'Super Admin' : userRole}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// // src/components/layout/Sidebar.jsx

// import React, { useMemo, useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';

// const Sidebar = ({ activePage, onNavigate, collapsed }) => {
//   const { userRole, isSuperAdmin, userName, userAvatar, hasPermission } = useAuth();
//   const [hovered, setHovered] = useState(null);

//   const navItems = useMemo(() => {
//     const items = [];

//     items.push({ type: 'section', id: 'main', label: 'Overview', order: 1 });

//     items.push({
//       type: 'item',
//       id: 'dashboard',
//       label: 'Dashboard',
//       icon: '🏠',
//       path: '/dashboard',
//       section: 'main',
//       order: 1,
//     });

//     if (isSuperAdmin) {
//       items.push({ type: 'section', id: 'super_admin', label: 'Super Admin', order: 2 });

//       if (hasPermission('view_admin_dashboard')) {
//         items.push({
//           type: 'item',
//           id: 'admin-stats',
//           label: 'Admin Stats',
//           icon: '📊',
//           path: '/admin/stats',
//           section: 'super_admin',
//           order: 1,
//         });
//       }

//       if (hasPermission('view_schools')) {
//         items.push({
//           type: 'item',
//           id: 'admin-schools',
//           label: 'Schools',
//           icon: '🏫',
//           path: '/admin/schools',
//           section: 'super_admin',
//           order: 2,
//         });
//       }

//       if (hasPermission('view_subscriptions')) {
//         items.push({
//           type: 'item',
//           id: 'admin-subscriptions',
//           label: 'Subscriptions',
//           icon: '💳',
//           path: '/admin/subscriptions',
//           section: 'super_admin',
//           order: 3,
//         });
//       }

//       if (hasPermission('view_users')) {
//         items.push({
//           type: 'item',
//           id: 'admin-users',
//           label: 'Users',
//           icon: '👥',
//           path: '/admin/users',
//           section: 'super_admin',
//           order: 4,
//         });
//       }

//       if (hasPermission('view_activity_logs')) {
//         items.push({
//           type: 'item',
//           id: 'admin-logs',
//           label: 'Activity Logs',
//           icon: '📜',
//           path: '/admin/logs',
//           section: 'super_admin',
//           order: 5,
//         });
//       }

//       if (hasPermission('manage_system_settings')) {
//         items.push({
//           type: 'item',
//           id: 'admin-settings',
//           label: 'System Settings',
//           icon: '⚙️',
//           path: '/admin/settings',
//           section: 'super_admin',
//           order: 6,
//         });
//       }
//     }

//     if (['principal', 'teacher', 'super_admin'].includes(userRole)) {
//       items.push({ type: 'section', id: 'academic', label: 'Academic', order: 3 });

//       if (['principal', 'teacher', 'accountant', 'super_admin'].includes(userRole)) {
//         items.push({
//           type: 'item',
//           id: 'students',
//           label: 'Students',
//           icon: '🎒',
//           path: '/students',
//           section: 'academic',
//           order: 1,
//         });
//       }

//       if (['principal', 'super_admin'].includes(userRole)) {
//         items.push({
//           type: 'item',
//           id: 'teachers',
//           label: 'Teachers',
//           icon: '👨‍🏫',
//           path: '/teachers',
//           section: 'academic',
//           order: 2,
//         });
//       }

//       if (['principal', 'teacher', 'super_admin'].includes(userRole)) {
//         items.push({
//           type: 'item',
//           id: 'classes',
//           label: 'Classes',
//           icon: '🏫',
//           path: '/classes',
//           section: 'academic',
//           order: 3,
//         });
//       }

//       items.push({
//         type: 'item',
//         id: 'attendance',
//         label: 'Attendance',
//         icon: '✅',
//         path: '/attendance',
//         section: 'academic',
//         order: 4,
//       });

//       items.push({
//         type: 'item',
//         id: 'assignments',
//         label: 'Assignments',
//         icon: '📝',
//         path: '/assignments',
//         section: 'academic',
//         order: 5,
//       });

//       items.push({
//         type: 'item',
//         id: 'exams',
//         label: 'Exams',
//         icon: '📋',
//         path: '/exams',
//         section: 'academic',
//         order: 6,
//       });
//     }

//     if (['principal', 'accountant', 'super_admin'].includes(userRole)) {
//       items.push({ type: 'section', id: 'admin', label: 'Management', order: 4 });

//       items.push({
//         type: 'item',
//         id: 'fees',
//         label: 'Fees',
//         icon: '💰',
//         path: '/fees',
//         section: 'admin',
//         order: 1,
//       });
//     }

//     items.push({ type: 'section', id: 'resources', label: 'Resources', order: 5 });

//     items.push({
//       type: 'item',
//       id: 'notices',
//       label: 'Notices',
//       icon: '📢',
//       path: '/notices',
//       section: 'resources',
//       order: 1,
//     });

//     items.push({
//       type: 'item',
//       id: 'timetable',
//       label: 'Timetable',
//       icon: '🗓️',
//       path: '/timetable',
//       section: 'resources',
//       order: 2,
//     });

//     return items;
//   }, [userRole, isSuperAdmin, hasPermission]);

//   const handleNavClick = (path) => {
//     if (onNavigate) onNavigate(path);
//   };

//   const isItemActive = (item) => {
//     if (!item?.path) return false;

//     if (activePage === item.id) return true;
//     if (activePage === item.path) return true;

//     if (item.path !== '/dashboard' && typeof activePage === 'string') {
//       return activePage.startsWith(item.path);
//     }

//     return false;
//   };

//   const containerStyle = {
//     width: collapsed ? 72 : 240,
//     height: '100vh',
//     background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
//     color: '#e2e8f0',
//     display: 'flex',
//     flexDirection: 'column',
//     transition: 'width 0.2s ease',
//     overflowX: 'hidden',
//     position: 'relative',
//   };

//   const menuItemStyle = (isActive, isSection) => ({
//     display: 'flex',
//     alignItems: 'center',
//     gap: collapsed ? 0 : 10,
//     padding: collapsed ? '14px 0' : '12px 16px',
//     margin: isSection ? '16px 8px 4px 8px' : '2px 8px',
//     borderRadius: 10,
//     cursor: isSection ? 'default' : 'pointer',
//     background: isActive ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
//     color: isActive ? '#60a5fa' : '#cbd5e1',
//     fontWeight: isActive ? 700 : isSection ? 700 : 500,
//     fontSize: isSection ? 11 : 13,
//     textTransform: isSection ? 'uppercase' : 'none',
//     letterSpacing: isSection ? 0.8 : 0,
//     transition: 'all 0.15s',
//     justifyContent: collapsed && !isSection ? 'center' : 'flex-start',
//     opacity: isSection ? 0.6 : 1,
//     position: 'relative',
//   });

//   return (
//     <div style={containerStyle}>
//       <div
//         style={{
//           padding: collapsed ? '20px 0' : '20px 16px',
//           borderBottom: '1px solid rgba(255,255,255,0.1)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: collapsed ? 'center' : 'flex-start',
//           gap: 12,
//         }}
//       >
//         <div
//           style={{
//             width: 36,
//             height: 36,
//             borderRadius: 10,
//             background: isSuperAdmin
//               ? 'linear-gradient(135deg, #be123c, #9f1239)'
//               : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: 18,
//             flexShrink: 0,
//           }}
//         >
//           {isSuperAdmin ? '🛡️' : '🏫'}
//         </div>

//         {!collapsed && (
//           <div style={{ overflow: 'hidden' }}>
//             <div style={{ fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap' }}>
//               {isSuperAdmin ? 'EduManage Admin' : 'EduManage'}
//             </div>
//             <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>
//               {isSuperAdmin ? 'Platform Control' : 'School System'}
//             </div>
//           </div>
//         )}
//       </div>

//       <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
//         {navItems.map((item) => {
//           const isSection = item.type === 'section';

//           if (isSection) {
//             return (
//               <div key={item.id} style={menuItemStyle(false, true)}>
//                 {!collapsed && item.label}
//               </div>
//             );
//           }

//           const isActive = isItemActive(item);

//           return (
//             <div
//               key={item.id}
//               onClick={() => handleNavClick(item.path)}
//               style={menuItemStyle(isActive, false)}
//               onMouseEnter={() => setHovered(item.id)}
//               onMouseLeave={() => setHovered(null)}
//             >
//               <span
//                 style={{
//                   fontSize: 16,
//                   width: collapsed ? 24 : 'auto',
//                   textAlign: 'center',
//                   flexShrink: 0,
//                 }}
//               >
//                 {item.icon}
//               </span>

//               {!collapsed && (
//                 <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                   {item.label}
//                 </span>
//               )}

//               {collapsed && hovered === item.id && (
//                 <div
//                   style={{
//                     position: 'absolute',
//                     left: 72,
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: '#1e293b',
//                     padding: '6px 12px',
//                     borderRadius: 6,
//                     fontSize: 12,
//                     whiteSpace: 'nowrap',
//                     zIndex: 100,
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
//                     pointerEvents: 'none',
//                   }}
//                 >
//                   {item.label}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <div
//         style={{
//           padding: collapsed ? '14px 0' : '14px 16px',
//           borderTop: '1px solid rgba(255,255,255,0.1)',
//           display: 'flex',
//           alignItems: 'center',
//           gap: collapsed ? 0 : 10,
//           justifyContent: collapsed ? 'center' : 'flex-start',
//           cursor: 'pointer',
//           transition: 'background 0.15s',
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.background = 'transparent';
//         }}
//       >
//         {userAvatar ? (
//           <img
//             src={userAvatar}
//             alt={userName || 'User'}
//             style={{
//               width: 32,
//               height: 32,
//               borderRadius: '50%',
//               objectFit: 'cover',
//               flexShrink: 0,
//               border: '2px solid rgba(255,255,255,0.15)',
//             }}
//           />
//         ) : (
//           <div
//             style={{
//               width: 32,
//               height: 32,
//               borderRadius: '50%',
//               background: isSuperAdmin
//                 ? 'linear-gradient(135deg, #be123c, #9f1239)'
//                 : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: 12,
//               fontWeight: 700,
//               color: 'white',
//               flexShrink: 0,
//             }}
//           >
//             {userName ? userName.charAt(0).toUpperCase() : 'U'}
//           </div>
//         )}

//         {!collapsed && (
//           <div style={{ overflow: 'hidden', flex: 1 }}>
//             <div
//               style={{
//                 fontSize: 12,
//                 fontWeight: 600,
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//               }}
//             >
//               {userName || 'User'}
//             </div>
//             <div
//               style={{
//                 fontSize: 10,
//                 color: '#94a3b8',
//                 textTransform: 'capitalize',
//               }}
//             >
//               {isSuperAdmin ? 'Super Admin' : String(userRole || 'user').replace('_', ' ')}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// src/components/layout/Sidebar.jsx
import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ activePage, onNavigate, collapsed }) => {
  const { userRole, isSuperAdmin, userName, userAvatar } = useAuth();
  const [hovered, setHovered] = useState(null);

  const navItems = useMemo(() => {
    const items = [];

    items.push({ type: 'section', id: 'main', label: 'Overview', order: 1 });

    items.push({
      type: 'item',
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/dashboard',
      section: 'main',
      order: 1,
    });

    /* ── Super Admin Section ── */
    if (isSuperAdmin) {
      items.push({ type: 'section', id: 'super_admin', label: 'Super Admin', order: 2 });

      // FIXED: Removed hasPermission() checks. If isSuperAdmin is true, show everything.
      items.push({
        type: 'item',
        id: 'admin-stats',
        label: 'Admin Stats',
        icon: '📊',
        path: '/admin/stats',
        section: 'super_admin',
        order: 1,
      });

      items.push({
        type: 'item',
        id: 'admin-schools',
        label: 'Schools',
        icon: '🏫',
        path: '/admin/schools',
        section: 'super_admin',
        order: 2,
      });

      items.push({
        type: 'item',
        id: 'admin-subscriptions',
        label: 'Subscriptions',
        icon: '💳',
        path: '/admin/subscriptions',
        section: 'super_admin',
        order: 3,
      });

      items.push({
        type: 'item',
        id: 'admin-users',
        label: 'Users',
        icon: '👥',
        path: '/admin/users',
        section: 'super_admin',
        order: 4,
      });

      items.push({
        type: 'item',
        id: 'admin-logs',
        label: 'Activity Logs',
        icon: '📜',
        path: '/admin/logs',
        section: 'super_admin',
        order: 5,
      });

      items.push({
        type: 'item',
        id: 'admin-settings',
        label: 'System Settings',
        icon: '⚙️',
        path: '/admin/settings',
        section: 'super_admin',
        order: 6,
      });
    }

    /* ── Academic Section ── */
    if (['principal', 'teacher', 'super_admin'].includes(userRole)) {
      items.push({ type: 'section', id: 'academic', label: 'Academic', order: 3 });

      if (['principal', 'teacher', 'accountant', 'super_admin'].includes(userRole)) {
        items.push({
          type: 'item',
          id: 'students',
          label: 'Students',
          icon: '🎒',
          path: '/students',
          section: 'academic',
          order: 1,
        });
      }

      if (['principal', 'super_admin'].includes(userRole)) {
        items.push({
          type: 'item',
          id: 'teachers',
          label: 'Teachers',
          icon: '👨‍🏫',
          path: '/teachers',
          section: 'academic',
          order: 2,
        });
      }

      if (['principal', 'teacher', 'super_admin'].includes(userRole)) {
        items.push({
          type: 'item',
          id: 'classes',
          label: 'Classes',
          icon: '🏫',
          path: '/classes',
          section: 'academic',
          order: 3,
        });
      }

      items.push({
        type: 'item',
        id: 'attendance',
        label: 'Attendance',
        icon: '✅',
        path: '/attendance',
        section: 'academic',
        order: 4,
      });

      items.push({
        type: 'item',
        id: 'assignments',
        label: 'Assignments',
        icon: '📝',
        path: '/assignments',
        section: 'academic',
        order: 5,
      });

      items.push({
        type: 'item',
        id: 'exams',
        label: 'Exams',
        icon: '📋',
        path: '/exams',
        section: 'academic',
        order: 6,
      });
    }

    /* ── Management Section ── */
    if (['principal', 'accountant', 'super_admin'].includes(userRole)) {
      items.push({ type: 'section', id: 'admin', label: 'Management', order: 4 });

      items.push({
        type: 'item',
        id: 'fees',
        label: 'Fees',
        icon: '💰',
        path: '/fees',
        section: 'admin',
        order: 1,
      });
    }

    /* ── Resources Section ── */
    items.push({ type: 'section', id: 'resources', label: 'Resources', order: 5 });

    items.push({
      type: 'item',
      id: 'notices',
      label: 'Notices',
      icon: '📢',
      path: '/notices',
      section: 'resources',
      order: 1,
    });

    items.push({
      type: 'item',
      id: 'timetable',
      label: 'Timetable',
      icon: '🗓️',
      path: '/timetable',
      section: 'resources',
      order: 2,
    });

    return items;
  }, [userRole, isSuperAdmin]); // Removed hasPermission dependency as it's no longer needed here

  const handleNavClick = (path) => {
    if (onNavigate) onNavigate(path);
  };

  const isItemActive = (item) => {
    if (!item?.path) return false;

    if (activePage === item.id) return true;
    if (activePage === item.path) return true;

    if (item.path !== '/dashboard' && typeof activePage === 'string') {
      return activePage.startsWith(item.path);
    }

    return false;
  };

  const containerStyle = {
    width: collapsed ? 72 : 240,
    height: '100vh',
    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    color: '#e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.2s ease',
    overflowX: 'hidden',
    position: 'relative',
  };

  const menuItemStyle = (isActive, isSection) => ({
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? 0 : 10,
    padding: collapsed ? '14px 0' : '12px 16px',
    margin: isSection ? '16px 8px 4px 8px' : '2px 8px',
    borderRadius: 10,
    cursor: isSection ? 'default' : 'pointer',
    background: isActive ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
    color: isActive ? '#60a5fa' : '#cbd5e1',
    fontWeight: isActive ? 700 : isSection ? 700 : 500,
    fontSize: isSection ? 11 : 13,
    textTransform: isSection ? 'uppercase' : 'none',
    letterSpacing: isSection ? 0.8 : 0,
    transition: 'all 0.15s',
    justifyContent: collapsed && !isSection ? 'center' : 'flex-start',
    opacity: isSection ? 0.6 : 1,
    position: 'relative',
  });

  return (
    <div style={containerStyle}>
      <div
        style={{
          padding: collapsed ? '20px 0' : '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: isSuperAdmin
              ? 'linear-gradient(135deg, #be123c, #9f1239)'
              : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {isSuperAdmin ? '🛡️' : '🏫'}
        </div>

        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap' }}>
              {isSuperAdmin ? 'EduManage Admin' : 'EduManage'}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>
              {isSuperAdmin ? 'Platform Control' : 'School System'}
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {navItems.map((item) => {
          const isSection = item.type === 'section';

          if (isSection) {
            return (
              <div key={item.id} style={menuItemStyle(false, true)}>
                {!collapsed && item.label}
              </div>
            );
          }

          const isActive = isItemActive(item);

          return (
            <div
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              style={menuItemStyle(isActive, false)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                style={{
                  fontSize: 16,
                  width: collapsed ? 24 : 'auto',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              )}

              {collapsed && hovered === item.id && (
                <div
                  style={{
                    position: 'absolute',
                    left: 72,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#1e293b',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    pointerEvents: 'none',
                  }}
                >
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: collapsed ? '14px 0' : '14px 16px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName || 'User'}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              border: '2px solid rgba(255,255,255,0.15)',
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isSuperAdmin
                ? 'linear-gradient(135deg, #be123c, #9f1239)'
                : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
            }}
          >
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
        )}

        {!collapsed && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {userName || 'User'}
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#94a3b8',
                textTransform: 'capitalize',
              }}
            >
              {isSuperAdmin ? 'Super Admin' : String(userRole || 'user').replace('_', ' ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;