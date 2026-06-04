// import React, { useState, useEffect } from 'react';
// // import useAuth from '../hooks/useAuth';
// // ✅ New (Named)
// import { useAuth } from '../hooks/useAuth';
// import {
//   getDashboardStats,
//   getRecentActivity,
//   getUpcomingEvents,
//   getBirthdaysToday,
// } from '../api/dashboardApi';
// import Loading from '../components/common/Loading';
// import Alert   from '../components/common/Alert';

// const Dashboard = () => {
//   const { user, userRole, userName, isPrincipal, isTeacher, can } = useAuth();

//   const [stats,     setStats]     = useState(null);
//   const [activity,  setActivity]  = useState([]);
//   const [events,    setEvents]    = useState([]);
//   const [birthdays, setBirthdays] = useState([]);
//   const [loading,   setLoading]   = useState(true);
//   const [error,     setError]     = useState('');

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [s, a, e, b] = await Promise.allSettled([
//           getDashboardStats(userRole),
//           getRecentActivity(),
//           getUpcomingEvents(),
//           getBirthdaysToday(),
//         ]);
//         if (s.status === 'fulfilled') setStats(s.value?.data || s.value);
//         if (a.status === 'fulfilled') setActivity(a.value?.data || []);
//         if (e.status === 'fulfilled') setEvents(e.value?.data   || []);
//         if (b.status === 'fulfilled') setBirthdays(b.value?.data || []);
//       } catch (err) {
//         setError('Failed to load dashboard data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [userRole]);

//   const greeting = () => {
//     const h = new Date().getHours();
//     if (h < 12) return '🌅 Good Morning';
//     if (h < 17) return '☀️ Good Afternoon';
//     return '🌙 Good Evening';
//   };

//   /* ── stat cards config ── */
//   const statCards = [
//     ...(isPrincipal || isTeacher
//       ? [
//           { label: 'Total Students',  value: stats?.totalStudents  ?? '—', icon: '🎒', color: '#2563eb', bg: '#eff6ff', change: stats?.studentChange   },
//           { label: 'Total Teachers',  value: stats?.totalTeachers  ?? '—', icon: '👨‍🏫', color: '#7c3aed', bg: '#f5f3ff', change: stats?.teacherChange   },
//           { label: 'Total Classes',   value: stats?.totalClasses   ?? '—', icon: '🏫', color: '#0284c7', bg: '#e0f2fe', change: null                     },
//           { label: 'Attendance Today',value: stats?.todayAttendance ? `${stats.todayAttendance}%` : '—', icon: '✅', color: '#16a34a', bg: '#dcfce7', change: null },
//         ]
//       : []),
//     ...(isPrincipal
//       ? [
//           { label: 'Fees Collected',  value: stats?.feesCollected  ? `₹${Number(stats.feesCollected).toLocaleString('en-IN')}` : '—', icon: '💰', color: '#d97706', bg: '#fef9c3', change: null },
//           { label: 'Pending Fees',    value: stats?.pendingFees    ? `₹${Number(stats.pendingFees).toLocaleString('en-IN')}` : '—',   icon: '⏳', color: '#dc2626', bg: '#fee2e2', change: null },
//         ]
//       : []),
//     ...(isTeacher
//       ? [
//           { label: 'My Classes',      value: stats?.myClasses      ?? '—', icon: '📚', color: '#16a34a', bg: '#dcfce7', change: null },
//           { label: 'Assignments Due', value: stats?.assignmentsDue ?? '—', icon: '📝', color: '#dc2626', bg: '#fee2e2', change: null },
//         ]
//       : []),
//   ];

//   if (loading) return (
//     <div>
//       <Loading type="skeleton" rows={6} text="Loading dashboard..." />
//     </div>
//   );

//   return (
//     <div>
//       {error && (
//         <Alert type="error" message={error} dismissible onClose={() => setError('')}
//           style={{ marginBottom: 16 }} />
//       )}

//       {/* Greeting */}
//       <div style={{
//         background: 'linear-gradient(135deg,#1e3a8a,#2563eb,#0284c7)',
//         borderRadius: 16, padding: '28px 32px', marginBottom: 28,
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         flexWrap: 'wrap', gap: 16, overflow: 'hidden', position: 'relative',
//       }}>
//         {[
//           { size: 200, top: -50,  right: -50, opacity: 0.08 },
//           { size: 120, top: '60%',left: '40%',opacity: 0.06 },
//         ].map((c, i) => (
//           <div key={i} style={{
//             position: 'absolute', width: c.size, height: c.size,
//             borderRadius: '50%', background: 'white',
//             opacity: c.opacity, top: c.top, right: c.right, left: c.left,
//           }} />
//         ))}
//         <div style={{ position: 'relative' }}>
//           <div style={{ color: '#bfdbfe', fontSize: 14, marginBottom: 4 }}>
//             {greeting()}
//           </div>
//           <h1 style={{ color: 'white', margin: '0 0 6px', fontSize: 26, fontWeight: 800 }}>
//             {userName} 👋
//           </h1>
//           <p style={{ color: '#93c5fd', margin: 0, fontSize: 14 }}>
//             {new Date().toLocaleDateString('en-IN', {
//               weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
//             })}
//           </p>
//         </div>
//         <div style={{
//           background: 'rgba(255,255,255,0.15)', borderRadius: 14,
//           padding: '16px 24px', backdropFilter: 'blur(10px)',
//           border: '1px solid rgba(255,255,255,0.2)', position: 'relative',
//         }}>
//           <div style={{ color: '#bfdbfe', fontSize: 12, marginBottom: 4 }}>Logged in as</div>
//           <div style={{ color: 'white', fontSize: 18, fontWeight: 800 }}>
//             {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
//           </div>
//           <div style={{ color: '#93c5fd', fontSize: 12, marginTop: 2 }}>
//             {user?.email || ''}
//           </div>
//         </div>
//       </div>

//       {/* Stat cards */}
//       {statCards.length > 0 && (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
//           gap: 16, marginBottom: 28,
//         }}>
//           {statCards.map(({ label, value, icon, color, bg, change }) => (
//             <div key={label} style={{
//               background: 'white', borderRadius: 14,
//               boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
//               padding: '20px 22px',
//               display: 'flex', flexDirection: 'column', gap: 10,
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               cursor: 'default',
//             }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform    = 'translateY(-3px)';
//                 e.currentTarget.style.boxShadow    = '0 8px 24px rgba(0,0,0,0.1)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform    = 'translateY(0)';
//                 e.currentTarget.style.boxShadow    = '0 1px 3px rgba(0,0,0,0.08)';
//               }}
//             >
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                 <div style={{
//                   width: 48, height: 48, borderRadius: 12, background: bg,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
//                 }}>
//                   {icon}
//                 </div>
//                 {change !== undefined && change !== null && (
//                   <span style={{
//                     fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
//                     background: change >= 0 ? '#dcfce7' : '#fee2e2',
//                     color: change >= 0 ? '#166534' : '#991b1b',
//                   }}>
//                     {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
//                 <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Bottom grid */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, flexWrap: 'wrap' }}>

//         {/* Recent Activity */}
//         <div style={{
//           background: 'white', borderRadius: 14,
//           boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
//         }}>
//           <div style={{
//             padding: '18px 22px', borderBottom: '1px solid #f1f5f9',
//             display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//           }}>
//             <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
//               🕐 Recent Activity
//             </div>
//             <span style={{ fontSize: 12, color: '#94a3b8' }}>Last 7 days</span>
//           </div>
//           <div style={{ padding: '8px 0', maxHeight: 380, overflowY: 'auto' }}>
//             {activity.length === 0 ? (
//               <div style={{ padding: '40px 24px', textAlign: 'center', color: '#94a3b8' }}>
//                 <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
//                 <p style={{ margin: 0, fontSize: 14 }}>No recent activity</p>
//               </div>
//             ) : activity.map((item, i) => (
//               <div key={i} style={{
//                 display: 'flex', alignItems: 'flex-start', gap: 14,
//                 padding: '12px 22px',
//                 borderBottom: i < activity.length - 1 ? '1px solid #f8fafc' : 'none',
//               }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
//                 onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
//               >
//                 <div style={{
//                   width: 36, height: 36, borderRadius: 10, flexShrink: 0,
//                   background: item.color || '#eff6ff',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
//                 }}>
//                   {item.icon || '📌'}
//                 </div>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
//                     {item.title || item.message}
//                   </div>
//                   <div style={{ fontSize: 12, color: '#94a3b8' }}>
//                     {item.description || item.time || ''}
//                   </div>
//                 </div>
//                 <div style={{ fontSize: 11, color: '#cbd5e1', flexShrink: 0 }}>
//                   {item.timeAgo || ''}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right column */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

//           {/* Upcoming Events */}
//           <div style={{
//             background: 'white', borderRadius: 14,
//             boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
//           }}>
//             <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
//               <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>📅 Upcoming Events</div>
//             </div>
//             <div style={{ padding: '8px 0', maxHeight: 200, overflowY: 'auto' }}>
//               {events.length === 0 ? (
//                 <div style={{ padding: '28px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
//                   No upcoming events
//                 </div>
//               ) : events.slice(0, 5).map((ev, i) => (
//                 <div key={i} style={{
//                   display: 'flex', alignItems: 'center', gap: 12,
//                   padding: '10px 20px',
//                   borderBottom: i < events.length - 1 ? '1px solid #f8fafc' : 'none',
//                 }}>
//                   <div style={{
//                     width: 40, borderRadius: 8, textAlign: 'center',
//                     background: '#eff6ff', padding: '4px 0', flexShrink: 0,
//                   }}>
//                     <div style={{ fontSize: 14, fontWeight: 800, color: '#2563eb' }}>
//                       {new Date(ev.date).getDate()}
//                     </div>
//                     <div style={{ fontSize: 9, color: '#60a5fa', textTransform: 'uppercase', fontWeight: 700 }}>
//                       {new Date(ev.date).toLocaleString('default', { month: 'short' })}
//                     </div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{ev.title}</div>
//                     <div style={{ fontSize: 11, color: '#94a3b8' }}>{ev.type || ev.category}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Birthdays */}
//           {birthdays.length > 0 && (
//             <div style={{
//               background: 'linear-gradient(135deg,#fdf4ff,#fce7f3)',
//               borderRadius: 14, border: '1px solid #e9d5ff',
//               overflow: 'hidden',
//             }}>
//               <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9d5ff' }}>
//                 <div style={{ fontWeight: 800, fontSize: 14, color: '#6b21a8' }}>
//                   🎂 Birthdays Today
//                 </div>
//               </div>
//               <div style={{ padding: '8px 0' }}>
//                 {birthdays.slice(0, 4).map((b, i) => (
//                   <div key={i} style={{
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     padding: '8px 20px',
//                   }}>
//                     <div style={{
//                       width: 32, height: 32, borderRadius: 8,
//                       background: 'linear-gradient(135deg,#9333ea,#c026d3)',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0,
//                     }}>
//                       {(b.name || 'U').charAt(0)}
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: '#6b21a8' }}>{b.name}</div>
//                       <div style={{ fontSize: 11, color: '#a78bfa' }}>{b.role || b.class}</div>
//                     </div>
//                     <div style={{ marginLeft: 'auto', fontSize: 18 }}>🎉</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Quick links */}
//           <div style={{
//             background: 'white', borderRadius: 14,
//             boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 18,
//           }}>
//             <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 14 }}>
//               ⚡ Quick Actions
//             </div>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
//               {[
//                 ...(can.manageStudents ? [{ icon: '🎒', label: 'Add Student',   href: '/students'   }] : []),
//                 ...(can.manageTeachers ? [{ icon: '👨‍🏫', label: 'Add Teacher',   href: '/teachers'   }] : []),
//                 ...(can.manageAttendance?[{ icon: '✅', label: 'Attendance',    href: '/attendance' }] : []),
//                 ...(can.manageNotices  ? [{ icon: '📢', label: 'Post Notice',   href: '/notices'    }] : []),
//                 ...(can.manageFees     ? [{ icon: '💰', label: 'Collect Fees',  href: '/fees'       }] : []),
//                 ...(can.manageExams    ? [{ icon: '📝', label: 'Exams',         href: '/exams'      }] : []),
//               ].slice(0, 6).map(({ icon, label, href }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   style={{
//                     display: 'flex', alignItems: 'center', gap: 8,
//                     padding: '10px 12px', borderRadius: 10,
//                     background: '#f8fafc', border: '1px solid #f1f5f9',
//                     textDecoration: 'none', color: '#374151',
//                     fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background   = '#eff6ff';
//                     e.currentTarget.style.borderColor  = '#bfdbfe';
//                     e.currentTarget.style.color        = '#2563eb';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background   = '#f8fafc';
//                     e.currentTarget.style.borderColor  = '#f1f5f9';
//                     e.currentTarget.style.color        = '#374151';
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{icon}</span>
//                   {label}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// // Code Updated 




// //src/pages/Dashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import {
//   getDashboardStats,
//   getRecentActivity,
//   getUpcomingEvents,
//   getBirthdaysToday,
// } from '../api/dashboardApi';
// import Loading from '../components/common/Loading';
// import Alert   from '../components/common/Alert';

// const Dashboard = () => {
//   const { user, userRole, userName, isPrincipal, isTeacher, isSuperAdmin, can } = useAuth();

//   const [stats,     setStats]     = useState(null);
//   const [activity,  setActivity]  = useState([]);
//   const [events,    setEvents]    = useState([]);
//   const [birthdays, setBirthdays] = useState([]);
//   const [loading,   setLoading]   = useState(true);
//   const [error,     setError]     = useState('');

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         // Super Admin might not have school-specific data, 
//         // but we attempt to fetch anyway.
//         const [s, a, e, b] = await Promise.allSettled([
//           getDashboardStats(userRole),
//           getRecentActivity(),
//           getUpcomingEvents(),
//           getBirthdaysToday(),
//         ]);
//         if (s.status === 'fulfilled') setStats(s.value?.data || s.value);
//         if (a.status === 'fulfilled') setActivity(a.value?.data || []);
//         if (e.status === 'fulfilled') setEvents(e.value?.data   || []);
//         if (b.status === 'fulfilled') setBirthdays(b.value?.data || []);
//       } catch (err) {
//         setError('Failed to load dashboard data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [userRole]);

//   const greeting = () => {
//     const h = new Date().getHours();
//     if (h < 12) return '🌅 Good Morning';
//     if (h < 17) return '☀️ Good Afternoon';
//     return '🌙 Good Evening';
//   };

//   /* ── Stat cards config ── */
//   // 1. Super Admin Cards (Platform Wide)
//   const superAdminCards = [
//     { label: 'Total Schools',  value: stats?.totalSchools ?? '—', icon: '🏛️', color: '#2563eb', bg: '#eff6ff' },
//     { label: 'Active Users',   value: stats?.activeUsers  ?? '—', icon: '👥', color: '#7c3aed', bg: '#f5f3ff' },
//     { label: 'Subscriptions',  value: stats?.subscriptions ?? '—', icon: '💳', color: '#0284c7', bg: '#e0f2fe' },
//     { label: 'System Health',  value: stats?.systemHealth ?? 'Good', icon: '✅', color: '#16a34a', bg: '#dcfce7' },
//   ];

//   // 2. Standard School Cards (Principal/Teacher)
//   const standardCards = [
//     ...(isPrincipal || isTeacher
//       ? [
//           { label: 'Total Students',  value: stats?.totalStudents  ?? '—', icon: '🎒', color: '#2563eb', bg: '#eff6ff', change: stats?.studentChange   },
//           { label: 'Total Teachers',  value: stats?.totalTeachers  ?? '—', icon: '👨‍🏫', color: '#7c3aed', bg: '#f5f3ff', change: stats?.teacherChange   },
//           { label: 'Total Classes',   value: stats?.totalClasses   ?? '—', icon: '🏫', color: '#0284c7', bg: '#e0f2fe', change: null                     },
//           { label: 'Attendance Today',value: stats?.todayAttendance ? `${stats.todayAttendance}%` : '—', icon: '✅', color: '#16a34a', bg: '#dcfce7', change: null },
//         ]
//       : []),
//     ...(isPrincipal
//       ? [
//           { label: 'Fees Collected',  value: stats?.feesCollected  ? `₹${Number(stats.feesCollected).toLocaleString('en-IN')}` : '—', icon: '💰', color: '#d97706', bg: '#fef9c3', change: null },
//           { label: 'Pending Fees',    value: stats?.pendingFees    ? `₹${Number(stats.pendingFees).toLocaleString('en-IN')}` : '—',   icon: '⏳', color: '#dc2626', bg: '#fee2e2', change: null },
//         ]
//       : []),
//     ...(isTeacher
//       ? [
//           { label: 'My Classes',      value: stats?.myClasses      ?? '—', icon: '📚', color: '#16a34a', bg: '#dcfce7', change: null },
//           { label: 'Assignments Due', value: stats?.assignmentsDue ?? '—', icon: '📝', color: '#dc2626', bg: '#fee2e2', change: null },
//         ]
//       : []),
//   ];

//   // Select which cards to show based on role
//   const statCards = isSuperAdmin ? superAdminCards : standardCards;

//   if (loading) return (
//     <div>
//       <Loading type="skeleton" rows={6} text="Loading dashboard..." />
//     </div>
//   );

//   return (
//     <div>
//       {error && (
//         <Alert type="error" message={error} dismissible onClose={() => setError('')}
//           style={{ marginBottom: 16 }} />
//       )}

//       {/* Greeting */}
//       <div style={{
//         background: isSuperAdmin 
//           ? 'linear-gradient(135deg,#0f172a,#334155,#1e293b)' // Dark theme for Super Admin
//           : 'linear-gradient(135deg,#1e3a8a,#2563eb,#0284c7)',
//         borderRadius: 16, padding: '28px 32px', marginBottom: 28,
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         flexWrap: 'wrap', gap: 16, overflow: 'hidden', position: 'relative',
//       }}>
//         {[
//           { size: 200, top: -50,  right: -50, opacity: 0.08 },
//           { size: 120, top: '60%',left: '40%',opacity: 0.06 },
//         ].map((c, i) => (
//           <div key={i} style={{
//             position: 'absolute', width: c.size, height: c.size,
//             borderRadius: '50%', background: 'white',
//             opacity: c.opacity, top: c.top, right: c.right, left: c.left,
//           }} />
//         ))}
//         <div style={{ position: 'relative' }}>
//           <div style={{ color: '#bfdbfe', fontSize: 14, marginBottom: 4 }}>
//             {greeting()}
//           </div>
//           <h1 style={{ color: 'white', margin: '0 0 6px', fontSize: 26, fontWeight: 800 }}>
//             {userName} 👋
//           </h1>
//           <p style={{ color: '#93c5fd', margin: 0, fontSize: 14 }}>
//             {new Date().toLocaleDateString('en-IN', {
//               weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
//             })}
//           </p>
//         </div>
//         <div style={{
//           background: 'rgba(255,255,255,0.15)', borderRadius: 14,
//           padding: '16px 24px', backdropFilter: 'blur(10px)',
//           border: '1px solid rgba(255,255,255,0.2)', position: 'relative',
//         }}>
//           <div style={{ color: '#bfdbfe', fontSize: 12, marginBottom: 4 }}>Logged in as</div>
//           <div style={{ color: 'white', fontSize: 18, fontWeight: 800 }}>
//             {isSuperAdmin ? 'Super Admin' : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
//           </div>
//           <div style={{ color: '#93c5fd', fontSize: 12, marginTop: 2 }}>
//             {user?.email || ''}
//           </div>
//         </div>
//       </div>

//       {/* Super Admin Specific Panel */}
//       {isSuperAdmin && (
//         <div style={{
//           background: 'linear-gradient(135deg,#fff1f2,#fee2e2)', 
//           border: '1px solid #fecdd3',
//           borderRadius: 14, padding: 20, marginBottom: 24,
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//             <div style={{ fontSize: 32 }}>🛡️</div>
//             <div>
//               <div style={{ fontWeight: 800, color: '#be123c', fontSize: 16 }}>Platform Administration Mode</div>
//               <div style={{ color: '#f87171', fontSize: 13 }}>You have full access to all schools and system settings.</div>
//             </div>
//           </div>
//           {/* You can add a button here to navigate to a Super Admin page later */}
//           {/* <button style={{...}}>Manage Schools</button> */}
//         </div>
//       )}

//       {/* Stat cards */}
//       {statCards.length > 0 && (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
//           gap: 16, marginBottom: 28,
//         }}>
//           {statCards.map(({ label, value, icon, color, bg, change }) => (
//             <div key={label} style={{
//               background: 'white', borderRadius: 14,
//               boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
//               padding: '20px 22px',
//               display: 'flex', flexDirection: 'column', gap: 10,
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               cursor: 'default',
//             }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform    = 'translateY(-3px)';
//                 e.currentTarget.style.boxShadow    = '0 8px 24px rgba(0,0,0,0.1)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform    = 'translateY(0)';
//                 e.currentTarget.style.boxShadow    = '0 1px 3px rgba(0,0,0,0.08)';
//               }}
//             >
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                 <div style={{
//                   width: 48, height: 48, borderRadius: 12, background: bg,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
//                 }}>
//                   {icon}
//                 </div>
//                 {change !== undefined && change !== null && (
//                   <span style={{
//                     fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
//                     background: change >= 0 ? '#dcfce7' : '#fee2e2',
//                     color: change >= 0 ? '#166534' : '#991b1b',
//                   }}>
//                     {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
//                 <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Bottom grid - Only show for non-super-admins or if data exists */}
//       {!isSuperAdmin && (
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, flexWrap: 'wrap' }}>

//           {/* Recent Activity */}
//           <div style={{
//             background: 'white', borderRadius: 14,
//             boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
//           }}>
//             <div style={{
//               padding: '18px 22px', borderBottom: '1px solid #f1f5f9',
//               display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//             }}>
//               <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
//                 🕐 Recent Activity
//               </div>
//               <span style={{ fontSize: 12, color: '#94a3b8' }}>Last 7 days</span>
//             </div>
//             <div style={{ padding: '8px 0', maxHeight: 380, overflowY: 'auto' }}>
//               {activity.length === 0 ? (
//                 <div style={{ padding: '40px 24px', textAlign: 'center', color: '#94a3b8' }}>
//                   <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
//                   <p style={{ margin: 0, fontSize: 14 }}>No recent activity</p>
//                 </div>
//               ) : activity.map((item, i) => (
//                 <div key={i} style={{
//                   display: 'flex', alignItems: 'flex-start', gap: 14,
//                   padding: '12px 22px',
//                   borderBottom: i < activity.length - 1 ? '1px solid #f8fafc' : 'none',
//                 }}
//                   onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
//                   onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
//                 >
//                   <div style={{
//                     width: 36, height: 36, borderRadius: 10, flexShrink: 0,
//                     background: item.color || '#eff6ff',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
//                   }}>
//                     {item.icon || '📌'}
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
//                       {item.title || item.message}
//                     </div>
//                     <div style={{ fontSize: 12, color: '#94a3b8' }}>
//                       {item.description || item.time || ''}
//                     </div>
//                   </div>
//                   <div style={{ fontSize: 11, color: '#cbd5e1', flexShrink: 0 }}>
//                     {item.timeAgo || ''}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right column */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

//             {/* Upcoming Events */}
//             <div style={{
//               background: 'white', borderRadius: 14,
//               boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
//             }}>
//               <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
//                 <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>📅 Upcoming Events</div>
//               </div>
//               <div style={{ padding: '8px 0', maxHeight: 200, overflowY: 'auto' }}>
//                 {events.length === 0 ? (
//                   <div style={{ padding: '28px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
//                     No upcoming events
//                   </div>
//                 ) : events.slice(0, 5).map((ev, i) => (
//                   <div key={i} style={{
//                     display: 'flex', alignItems: 'center', gap: 12,
//                     padding: '10px 20px',
//                     borderBottom: i < events.length - 1 ? '1px solid #f8fafc' : 'none',
//                   }}>
//                     <div style={{
//                       width: 40, borderRadius: 8, textAlign: 'center',
//                       background: '#eff6ff', padding: '4px 0', flexShrink: 0,
//                     }}>
//                       <div style={{ fontSize: 14, fontWeight: 800, color: '#2563eb' }}>
//                         {new Date(ev.date).getDate()}
//                       </div>
//                       <div style={{ fontSize: 9, color: '#60a5fa', textTransform: 'uppercase', fontWeight: 700 }}>
//                         {new Date(ev.date).toLocaleString('default', { month: 'short' })}
//                       </div>
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{ev.title}</div>
//                       <div style={{ fontSize: 11, color: '#94a3b8' }}>{ev.type || ev.category}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Birthdays */}
//             {birthdays.length > 0 && (
//               <div style={{
//                 background: 'linear-gradient(135deg,#fdf4ff,#fce7f3)',
//                 borderRadius: 14, border: '1px solid #e9d5ff',
//                 overflow: 'hidden',
//               }}>
//                 <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9d5ff' }}>
//                   <div style={{ fontWeight: 800, fontSize: 14, color: '#6b21a8' }}>
//                     🎂 Birthdays Today
//                   </div>
//                 </div>
//                 <div style={{ padding: '8px 0' }}>
//                   {birthdays.slice(0, 4).map((b, i) => (
//                     <div key={i} style={{
//                       display: 'flex', alignItems: 'center', gap: 10,
//                       padding: '8px 20px',
//                     }}>
//                       <div style={{
//                         width: 32, height: 32, borderRadius: 8,
//                         background: 'linear-gradient(135deg,#9333ea,#c026d3)',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0,
//                       }}>
//                         {(b.name || 'U').charAt(0)}
//                       </div>
//                       <div>
//                         <div style={{ fontSize: 13, fontWeight: 600, color: '#6b21a8' }}>{b.name}</div>
//                         <div style={{ fontSize: 11, color: '#a78bfa' }}>{b.role || b.class}</div>
//                       </div>
//                       <div style={{ marginLeft: 'auto', fontSize: 18 }}>🎉</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quick links */}
//             <div style={{
//               background: 'white', borderRadius: 14,
//               boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 18,
//             }}>
//               <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 14 }}>
//                 ⚡ Quick Actions
//               </div>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
//                 {[
//                   ...(can.manageStudents ? [{ icon: '🎒', label: 'Add Student',   href: '/#/students'   }] : []),
//                   ...(can.manageTeachers ? [{ icon: '👨‍🏫', label: 'Add Teacher',   href: '/#/teachers'   }] : []),
//                   ...(can.manageAttendance?[{ icon: '✅', label: 'Attendance',    href: '/#/attendance' }] : []),
//                   ...(can.manageNotices  ? [{ icon: '📢', label: 'Post Notice',   href: '/#/notices'    }] : []),
//                   ...(can.manageFees     ? [{ icon: '💰', label: 'Collect Fees',  href: '/#/fees'       }] : []),
//                   ...(can.manageExams    ? [{ icon: '📝', label: 'Exams',         href: '/#/exams'      }] : []),
//                 ].slice(0, 6).map(({ icon, label, href }) => (
//                   <a
//                     key={label}
//                     href={href}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: 8,
//                       padding: '10px 12px', borderRadius: 10,
//                       background: '#f8fafc', border: '1px solid #f1f5f9',
//                       textDecoration: 'none', color: '#374151',
//                       fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.background   = '#eff6ff';
//                       e.currentTarget.style.borderColor  = '#bfdbfe';
//                       e.currentTarget.style.color        = '#2563eb';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.background   = '#f8fafc';
//                       e.currentTarget.style.borderColor  = '#f1f5f9';
//                       e.currentTarget.style.color        = '#374151';
//                     }}
//                   >
//                     <span style={{ fontSize: 16 }}>{icon}</span>
//                     {label}
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

//src/pages/Dashboard.jsx

// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getDashboardStats,
  getRecentActivity,
  getUpcomingEvents,
  getBirthdaysToday,
} from '../api/dashboardApi';
import Loading from '../components/common/Loading';
import Alert   from '../components/common/Alert';

const Dashboard = () => {
  const { user, userRole, userName, isPrincipal, isTeacher, isSuperAdmin, can } = useAuth();

  const [stats,     setStats]     = useState(null);
  const [activity,  setActivity]  = useState([]);
  const [events,    setEvents]    = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Super Admin might not have school-specific data, 
        // but we attempt to fetch anyway.
        const [s, a, e, b] = await Promise.allSettled([
          getDashboardStats(userRole),
          getRecentActivity(),
          getUpcomingEvents(),
          getBirthdaysToday(),
        ]);
        if (s.status === 'fulfilled') setStats(s.value?.data || s.value);
        if (a.status === 'fulfilled') setActivity(a.value?.data || []);
        if (e.status === 'fulfilled') setEvents(e.value?.data   || []);
        if (b.status === 'fulfilled') setBirthdays(b.value?.data || []);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userRole]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return '🌅 Good Morning';
    if (h < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  /* ── Stat cards config ── */
  // 1. Super Admin Cards (Platform Wide)
  const superAdminCards = [
    { label: 'Total Schools',  value: stats?.totalSchools ?? '—', icon: '🏛️', color: '#2563eb', bg: '#eff6ff' },
    { label: 'Active Users',   value: stats?.activeUsers  ?? '—', icon: '👥', color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Subscriptions',  value: stats?.subscriptions ?? '—', icon: '💳', color: '#0284c7', bg: '#e0f2fe' },
    { label: 'System Health',  value: stats?.systemHealth ?? 'Good', icon: '✅', color: '#16a34a', bg: '#dcfce7' },
  ];

  // 2. Standard School Cards (Principal/Teacher)
  const standardCards = [
    ...(isPrincipal || isTeacher
      ? [
          { label: 'Total Students',  value: stats?.totalStudents  ?? '—', icon: '🎒', color: '#2563eb', bg: '#eff6ff', change: stats?.studentChange   },
          { label: 'Total Teachers',  value: stats?.totalTeachers  ?? '—', icon: '👨‍🏫', color: '#7c3aed', bg: '#f5f3ff', change: stats?.teacherChange   },
          { label: 'Total Classes',   value: stats?.totalClasses   ?? '—', icon: '🏫', color: '#0284c7', bg: '#e0f2fe', change: null                     },
          { label: 'Attendance Today',value: stats?.todayAttendance ? `${stats.todayAttendance}%` : '—', icon: '✅', color: '#16a34a', bg: '#dcfce7', change: null },
        ]
      : []),
    ...(isPrincipal
      ? [
          { label: 'Fees Collected',  value: stats?.feesCollected  ? `₹${Number(stats.feesCollected).toLocaleString('en-IN')}` : '—', icon: '💰', color: '#d97706', bg: '#fef9c3', change: null },
          { label: 'Pending Fees',    value: stats?.pendingFees    ? `₹${Number(stats.pendingFees).toLocaleString('en-IN')}` : '—',   icon: '⏳', color: '#dc2626', bg: '#fee2e2', change: null },
        ]
      : []),
    ...(isTeacher
      ? [
          { label: 'My Classes',      value: stats?.myClasses      ?? '—', icon: '📚', color: '#16a34a', bg: '#dcfce7', change: null },
          { label: 'Assignments Due', value: stats?.assignmentsDue ?? '—', icon: '📝', color: '#dc2626', bg: '#fee2e2', change: null },
        ]
      : []),
  ];

  // Select which cards to show based on role
  const statCards = isSuperAdmin ? superAdminCards : standardCards;

  if (loading) return (
    <div>
      <Loading type="skeleton" rows={6} text="Loading dashboard..." />
    </div>
  );

  return (
    <div>
      {error && (
        <Alert type="error" message={error} dismissible onClose={() => setError('')}
          style={{ marginBottom: 16 }} />
      )}

      {/* Greeting */}
      <div style={{
        background: isSuperAdmin 
          ? 'linear-gradient(135deg,#0f172a,#334155,#1e293b)' // Dark theme for Super Admin
          : 'linear-gradient(135deg,#1e3a8a,#2563eb,#0284c7)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16, overflow: 'hidden', position: 'relative',
      }}>
        {[
          { size: 200, top: -50,  right: -50, opacity: 0.08 },
          { size: 120, top: '60%',left: '40%',opacity: 0.06 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: c.size, height: c.size,
            borderRadius: '50%', background: 'white',
            opacity: c.opacity, top: c.top, right: c.right, left: c.left,
          }} />
        ))}
        <div style={{ position: 'relative' }}>
          <div style={{ color: '#bfdbfe', fontSize: 14, marginBottom: 4 }}>
            {greeting()}
          </div>
          <h1 style={{ color: 'white', margin: '0 0 6px', fontSize: 26, fontWeight: 800 }}>
            {userName} 👋
          </h1>
          <p style={{ color: '#93c5fd', margin: 0, fontSize: 14 }}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 14,
          padding: '16px 24px', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)', position: 'relative',
        }}>
          <div style={{ color: '#bfdbfe', fontSize: 12, marginBottom: 4 }}>Logged in as</div>
          <div style={{ color: 'white', fontSize: 18, fontWeight: 800 }}>
            {isSuperAdmin ? 'Super Admin' : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </div>
          <div style={{ color: '#93c5fd', fontSize: 12, marginTop: 2 }}>
            {user?.email || ''}
          </div>
        </div>
      </div>

      {/* Super Admin Specific Panel */}
      {isSuperAdmin && (
        <div style={{
          background: 'linear-gradient(135deg,#fff1f2,#fee2e2)', 
          border: '1px solid #fecdd3',
          borderRadius: 14, padding: 20, marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 32 }}>🛡️</div>
            <div>
              <div style={{ fontWeight: 800, color: '#be123c', fontSize: 16 }}>Platform Administration Mode</div>
              <div style={{ color: '#f87171', fontSize: 13 }}>You have full access to all schools and system settings.</div>
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      {statCards.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
          gap: 16, marginBottom: 28,
        }}>
          {statCards.map(({ label, value, icon, color, bg, change }) => (
            <div key={label} style={{
              background: 'white', borderRadius: 14,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              padding: '20px 22px',
              display: 'flex', flexDirection: 'column', gap: 10,
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform    = 'translateY(-3px)';
                e.currentTarget.style.boxShadow    = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform    = 'translateY(0)';
                e.currentTarget.style.boxShadow    = '0 1px 3px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>
                  {icon}
                </div>
                {change !== undefined && change !== null && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                    background: change >= 0 ? '#dcfce7' : '#fee2e2',
                    color: change >= 0 ? '#166534' : '#991b1b',
                  }}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                  </span>
                )}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, flexWrap: 'wrap' }}>
        
        {/* SUPER ADMIN QUICK ACTIONS (FIXED: Now they aren't stuck!) */}
        {isSuperAdmin && (
          <div style={{
            background: 'white', borderRadius: 14,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
            gridColumn: '1 / -1' // Spans full width
          }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>
              ⚡ Platform Quick Actions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { icon: '🏫', label: 'Manage Schools', href: '/#/admin/schools' },
                { icon: '➕', label: 'Add New School', href: '/#/admin/schools/create' },
                { icon: '👥', label: 'Manage Users', href: '/#/admin/users' },
                { icon: '💳', label: 'Subscriptions', href: '/#/admin/subscriptions' },
                { icon: '📊', label: 'Admin Stats', href: '/#/admin/stats' },
                { icon: '⚙️', label: 'System Settings', href: '/#/admin/settings' },
                { icon: '📜', label: 'Activity Logs', href: '/#/admin/logs' },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px 18px', borderRadius: 12,
                    background: '#f8fafc', border: '1px solid #f1f5f9',
                    textDecoration: 'none', color: '#374151',
                    fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background   = '#fff1f2';
                    e.currentTarget.style.borderColor  = '#fecdd3';
                    e.currentTarget.style.color        = '#be123c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background   = '#f8fafc';
                    e.currentTarget.style.borderColor  = '#f1f5f9';
                    e.currentTarget.style.color        = '#374151';
                  }}
                >
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* STANDARD SCHOOL USERS SECTION */}
        {!isSuperAdmin && (
          <>
            {/* Recent Activity */}
            <div style={{
              background: 'white', borderRadius: 14,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
            }}>
              <div style={{
                padding: '18px 22px', borderBottom: '1px solid #f1f5f9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
                  🕐 Recent Activity
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Last 7 days</span>
              </div>
              <div style={{ padding: '8px 0', maxHeight: 380, overflowY: 'auto' }}>
                {activity.length === 0 ? (
                  <div style={{ padding: '40px 24px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                    <p style={{ margin: 0, fontSize: 14 }}>No recent activity</p>
                  </div>
                ) : activity.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '12px 22px',
                    borderBottom: i < activity.length - 1 ? '1px solid #f8fafc' : 'none',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: item.color || '#eff6ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>
                      {item.icon || '📌'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
                        {item.title || item.message}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        {item.description || item.time || ''}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#cbd5e1', flexShrink: 0 }}>
                      {item.timeAgo || ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Upcoming Events */}
              <div style={{
                background: 'white', borderRadius: 14,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>📅 Upcoming Events</div>
                </div>
                <div style={{ padding: '8px 0', maxHeight: 200, overflowY: 'auto' }}>
                  {events.length === 0 ? (
                    <div style={{ padding: '28px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                      No upcoming events
                    </div>
                  ) : events.slice(0, 5).map((ev, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 20px',
                      borderBottom: i < events.length - 1 ? '1px solid #f8fafc' : 'none',
                    }}>
                      <div style={{
                        width: 40, borderRadius: 8, textAlign: 'center',
                        background: '#eff6ff', padding: '4px 0', flexShrink: 0,
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#2563eb' }}>
                          {new Date(ev.date).getDate()}
                        </div>
                        <div style={{ fontSize: 9, color: '#60a5fa', textTransform: 'uppercase', fontWeight: 700 }}>
                          {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{ev.title}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{ev.type || ev.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Birthdays */}
              {birthdays.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg,#fdf4ff,#fce7f3)',
                  borderRadius: 14, border: '1px solid #e9d5ff',
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9d5ff' }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#6b21a8' }}>
                      🎂 Birthdays Today
                    </div>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    {birthdays.slice(0, 4).map((b, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 20px',
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: 'linear-gradient(135deg,#9333ea,#c026d3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0,
                        }}>
                          {(b.name || 'U').charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b21a8' }}>{b.name}</div>
                          <div style={{ fontSize: 11, color: '#a78bfa' }}>{b.role || b.class}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: 18 }}>🎉</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div style={{
                background: 'white', borderRadius: 14,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 18,
              }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 14 }}>
                  ⚡ Quick Actions
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    ...(can.manageStudents ? [{ icon: '🎒', label: 'Add Student',   href: '/#/students'   }] : []),
                    ...(can.manageTeachers ? [{ icon: '👨‍🏫', label: 'Add Teacher',   href: '/#/teachers'   }] : []),
                    ...(can.manageAttendance?[{ icon: '✅', label: 'Attendance',    href: '/#/attendance' }] : []),
                    ...(can.manageNotices  ? [{ icon: '📢', label: 'Post Notice',   href: '/#/notices'    }] : []),
                    ...(can.manageFees     ? [{ icon: '💰', label: 'Collect Fees',  href: '/#/fees'       }] : []),
                    ...(can.manageExams    ? [{ icon: '📝', label: 'Exams',         href: '/#/exams'      }] : []),
                  ].slice(0, 6).map(({ icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 12px', borderRadius: 10,
                        background: '#f8fafc', border: '1px solid #f1f5f9',
                        textDecoration: 'none', color: '#374151',
                        fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background   = '#eff6ff';
                        e.currentTarget.style.borderColor  = '#bfdbfe';
                        e.currentTarget.style.color        = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background   = '#f8fafc';
                        e.currentTarget.style.borderColor  = '#f1f5f9';
                        e.currentTarget.style.color        = '#374151';
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;