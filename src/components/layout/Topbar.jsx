// // src/components/layout/Topbar.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';

// const Topbar = ({ activePage, user, userRole, onLogout, onToggleSidebar, sidebarCollapsed }) => {
//   const { isSuperAdmin } = useAuth();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Format Role Label
//   const roleLabel = isSuperAdmin 
//     ? 'Super Admin' 
//     : userRole?.charAt(0).toUpperCase() + userRole?.slice(1);

//   // Get initials for Avatar
//   const getInitials = () => {
//     if (!user?.first_name) return user?.email?.charAt(0).toUpperCase() || 'U';
//     return `${user.first_name.charAt(0)}${user.last_name?.charAt(0) || ''}`.toUpperCase();
//   };

//   return (
//     <header style={{
//       height: 64,
//       background: 'white',
//       borderBottom: '1px solid #e2e8f0',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       padding: '0 24px',
//       position: 'sticky',
//       top: 0,
//       zIndex: 100,
//     }}>
      
//       {/* Left Section: Hamburger & Title */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//         <button
//           onClick={onToggleSidebar}
//           style={{
//             background: 'none',
//             border: 'none',
//             cursor: 'pointer',
//             padding: 8,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: '#64748b',
//           }}
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             {sidebarCollapsed ? (
//               <path d="M3 12h18M3 6h18M3 18h18" />
//             ) : (
//               <path d="M4 6h16M4 12h16M4 18h16" />
//             )}
//           </svg>
//         </button>

//         <div>
//           <h1 style={{
//             margin: 0,
//             fontSize: 18,
//             fontWeight: 800,
//             color: '#0f172a',
//             textTransform: 'capitalize',
//           }}>
//             {activePage === 'dashboard' ? 'Dashboard' : activePage}
//           </h1>
//           <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
//             Welcome back, {user?.first_name || 'User'}!
//           </p>
//         </div>
//       </div>

//       {/* Right Section: Notifications & Profile */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        
//         {/* Notification Bell */}
//         <button style={{
//           background: 'none',
//           border: 'none',
//           cursor: 'pointer',
//           position: 'relative',
//           color: '#64748b',
//         }}>
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//             <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//           </svg>
//           <span style={{
//             position: 'absolute',
//             top: -2,
//             right: -2,
//             width: 10,
//             height: 10,
//             background: '#ef4444',
//             borderRadius: '50%',
//             border: '2px solid white',
//           }} />
//         </button>

//         {/* Profile Dropdown */}
//         <div style={{ position: 'relative' }} ref={dropdownRef}>
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: 10,
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               padding: '4px 8px',
//               borderRadius: 8,
//               transition: 'background 0.2s',
//             }}
//           >
//             {/* Avatar */}
//             <div style={{
//               width: 36,
//               height: 36,
//               borderRadius: '50%',
//               background: isSuperAdmin 
//                 ? 'linear-gradient(135deg, #be123c, #9f1239)' 
//                 : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: 14,
//               fontWeight: 700,
//             }}>
//               {getInitials()}
//             </div>

//             <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
//               <span style={{
//                 fontSize: 13,
//                 fontWeight: 600,
//                 color: '#0f172a',
//                 lineHeight: 1.2,
//               }}>
//                 {user?.first_name} {user?.last_name}
//               </span>
//               <span style={{
//                 fontSize: 11,
//                 color: '#64748b',
//                 lineHeight: 1.2,
//               }}>
//                 {roleLabel}
//               </span>
//             </div>

//             <svg 
//               width="16" 
//               height="16" 
//               viewBox="0 0 24 24" 
//               fill="none" 
//               stroke="#94a3b8" 
//               strokeWidth="2"
//               style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
//             >
//               <path d="M6 9l6 6 6-6" />
//             </svg>
//           </button>

//           {/* Dropdown Menu */}
//           {dropdownOpen && (
//             <div style={{
//               position: 'absolute',
//               top: 'calc(100% + 8px)',
//               right: 0,
//               width: 200,
//               background: 'white',
//               borderRadius: 12,
//               boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
//               border: '1px solid #f1f5f9',
//               overflow: 'hidden',
//               zIndex: 1000,
//             }}>
//               <div style={{
//                 padding: '12px 16px',
//                 borderBottom: '1px solid #f1f5f9',
//               }}>
//                 <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Logged in as</p>
//                 <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
//                   {user?.email}
//                 </p>
//               </div>

//               <div style={{ padding: '8px' }}>
//                 <button
//                   onClick={() => {
//                     setDropdownOpen(false);
//                     // Navigate to profile if implemented
//                   }}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 10,
//                     background: 'none',
//                     border: 'none',
//                     cursor: 'pointer',
//                     borderRadius: 8,
//                     fontSize: 13,
//                     color: '#374151',
//                     transition: 'background 0.15s',
//                   }}
//                 >
//                   <span>👤</span> My Profile
//                 </button>

//                 <button
//                   onClick={() => {
//                     setDropdownOpen(false);
//                     // Navigate to settings if implemented
//                   }}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 10,
//                     background: 'none',
//                     border: 'none',
//                     cursor: 'pointer',
//                     borderRadius: 8,
//                     fontSize: 13,
//                     color: '#374151',
//                     transition: 'background 0.15s',
//                   }}
//                 >
//                   <span>⚙️</span> Settings
//                 </button>
//               </div>

//               <div style={{ padding: '8px', borderTop: '1px solid #f1f5f9' }}>
//                 <button
//                   onClick={onLogout}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 10,
//                     background: '#fee2e2',
//                     border: 'none',
//                     cursor: 'pointer',
//                     borderRadius: 8,
//                     fontSize: 13,
//                     color: '#b91c1c',
//                     fontWeight: 600,
//                     transition: 'background 0.15s',
//                   }}
//                 >
//                   <span>🚪</span> Logout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Topbar;


// src/components/layout/Topbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  students: 'Students',
  teachers: 'Teachers',
  classes: 'Classes',
  attendance: 'Attendance',
  assignments: 'Assignments',
  exams: 'Exams',
  fees: 'Fees',
  notices: 'Notices',
  timetable: 'Timetable',
  'admin-stats': 'Admin Stats',
  'admin-schools': 'Schools',
  'admin-subscriptions': 'Subscriptions',
  'admin-users': 'Users',
  'admin-logs': 'Activity Logs',
  'admin-settings': 'System Settings',
};

const Topbar = ({
  activePage,
  user,
  userRole,
  onLogout,
  onToggleSidebar,
  sidebarCollapsed,
}) => {
  const { isSuperAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabel = isSuperAdmin
    ? 'Super Admin'
    : userRole?.charAt(0).toUpperCase() + userRole?.slice(1);

  const getInitials = () => {
    if (!user?.first_name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return `${user.first_name.charAt(0)}${user.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  const pageTitle = PAGE_TITLES[activePage] || 'Dashboard';

  return (
    <header
      style={{
        height: 64,
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            {pageTitle}
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
            Welcome back, {user?.first_name || 'User'}!
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            color: '#64748b',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 10,
              height: 10,
              background: '#ef4444',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        </button>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 8,
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: isSuperAdmin
                  ? 'linear-gradient(135deg, #be123c, #9f1239)'
                  : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {getInitials()}
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#0f172a',
                  lineHeight: 1.2,
                }}
              >
                {user?.first_name} {user?.last_name}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: '#64748b',
                  lineHeight: 1.2,
                }}
              >
                {roleLabel}
              </span>
            </div>

            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 200,
                background: 'white',
                borderRadius: 12,
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                border: '1px solid #f1f5f9',
                overflow: 'hidden',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Logged in as</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                  {user?.email}
                </p>
              </div>

              <div style={{ padding: '8px' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#374151',
                  }}
                >
                  <span>👤</span> My Profile
                </button>

                <button
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#374151',
                  }}
                >
                  <span>⚙️</span> Settings
                </button>
              </div>

              <div style={{ padding: '8px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={onLogout}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#fee2e2',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#b91c1c',
                    fontWeight: 600,
                  }}
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;