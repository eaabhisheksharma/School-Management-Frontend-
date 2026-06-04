// import React, { Suspense, useEffect } from 'react';
// import { AuthProvider }  from './context/AuthContext';
// import { ThemeProvider } from './context/ThemeContext';
// import AppRoutes         from './routes';
// import './styles/App.css';
// import './styles/components.css';

// /* ── Full-page spinner shown during lazy-loaded chunk loading ── */
// const PageLoader = () => (
//   <div style={{
//     minHeight       : '100vh',
//     display         : 'flex',
//     flexDirection   : 'column',
//     alignItems      : 'center',
//     justifyContent  : 'center',
//     gap             : 16,
//     background      : '#f8fafc',
//   }}>
//     <div style={{
//       width           : 56,
//       height          : 56,
//       borderRadius    : 16,
//       background      : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//       display         : 'flex',
//       alignItems      : 'center',
//       justifyContent  : 'center',
//       fontSize        : 28,
//       boxShadow       : '0 8px 24px rgba(37,99,235,0.4)',
//       animation       : 'pulse 1.5s ease-in-out infinite',
//     }}>
//       🏫
//     </div>
//     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//       <div style={{
//         width            : 22,
//         height           : 22,
//         borderRadius     : '50%',
//         border           : '3px solid #bfdbfe',
//         borderTopColor   : '#2563eb',
//         animation        : 'spin 0.7s linear infinite',
//       }} />
//       <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>
//         Loading School Management...
//       </span>
//     </div>
//     <style>{`
//       @keyframes spin  { to { transform: rotate(360deg); } }
//       @keyframes pulse {
//         0%,100% { transform: scale(1);    box-shadow: 0 8px 24px rgba(37,99,235,0.4); }
//         50%     { transform: scale(1.08); box-shadow: 0 12px 32px rgba(37,99,235,0.6); }
//       }
//     `}</style>
//   </div>
// );

// /* ── Global error boundary ── */
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }
//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }
//   componentDidCatch(error, info) {
//     console.error('App ErrorBoundary caught:', error, info);
//   }
//   render() {
//     if (!this.state.hasError) return this.props.children;
//     return (
//       <div style={{
//         minHeight       : '100vh',
//         display         : 'flex',
//         alignItems      : 'center',
//         justifyContent  : 'center',
//         padding         : 24,
//         background      : '#f8fafc',
//         fontFamily      : 'Inter, system-ui, sans-serif',
//       }}>
//         <div style={{
//           maxWidth      : 480,
//           width         : '100%',
//           textAlign     : 'center',
//           background    : 'white',
//           borderRadius  : 20,
//           padding       : 48,
//           boxShadow     : '0 20px 60px rgba(0,0,0,0.12)',
//           border        : '1px solid #fee2e2',
//         }}>
//           <div style={{ fontSize: 52, marginBottom: 16 }}>💥</div>
//           <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
//             Something Went Wrong
//           </h2>
//           <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
//             An unexpected error occurred. Please refresh the page or contact support if the problem persists.
//           </p>
//           {this.state.error && (
//             <details style={{
//               background    : '#fff1f2',
//               border        : '1px solid #fecdd3',
//               borderRadius  : 10,
//               padding       : '10px 14px',
//               marginBottom  : 24,
//               textAlign     : 'left',
//             }}>
//               <summary style={{ cursor: 'pointer', fontSize: 13, color: '#be123c', fontWeight: 700 }}>
//                 Error Details
//               </summary>
//               <pre style={{
//                 marginTop   : 10,
//                 fontSize    : 11,
//                 color       : '#9f1239',
//                 whiteSpace  : 'pre-wrap',
//                 wordBreak   : 'break-word',
//                 fontFamily  : 'monospace',
//               }}>
//                 {this.state.error.toString()}
//               </pre>
//             </details>
//           )}
//           <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
//             <button
//               onClick={() => window.location.reload()}
//               style={{
//                 padding       : '11px 28px',
//                 background    : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//                 color         : 'white',
//                 border        : 'none',
//                 borderRadius  : 10,
//                 fontSize      : 14,
//                 fontWeight    : 700,
//                 cursor        : 'pointer',
//                 boxShadow     : '0 4px 14px rgba(37,99,235,0.4)',
//               }}
//             >
//               🔄 Refresh Page
//             </button>
//             <button
//               onClick={() => { this.setState({ hasError: false, error: null }); }}
//               style={{
//                 padding       : '11px 28px',
//                 background    : 'white',
//                 color         : '#374151',
//                 border        : '1.5px solid #e2e8f0',
//                 borderRadius  : 10,
//                 fontSize      : 14,
//                 fontWeight    : 700,
//                 cursor        : 'pointer',
//               }}
//             >
//               ↩ Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// /* ════════════════════════════════════════════════════════════
//    APP ROOT
// ══════════════════════════════════════════════════════════════ */
// const App = () => {
//   /* Set document title */
//   useEffect(() => {
//     document.title = 'School Management System';
//   }, []);

//   return (
//     <ErrorBoundary>
//       <ThemeProvider>
//         <AuthProvider>
//           <Suspense fallback={<PageLoader />}>
//             <AppRoutes />
//           </Suspense>
//         </AuthProvider>
//       </ThemeProvider>
//     </ErrorBoundary>
//   );
// };

// export default App;

// //src/App.jsx
// //_______________Code Change __________________________________________

// import React, { Suspense } from 'react';
// import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import AuthProvider  from './context/AuthContext';
// import ThemeProvider from './context/ThemeContext';
// import Layout        from './components/layout/Layout';

// const Login       = React.lazy(() => import('./pages/Login'));
// const Dashboard   = React.lazy(() => import('./pages/Dashboard'));
// const Students    = React.lazy(() => import('./pages/Students'));
// const Teachers    = React.lazy(() => import('./pages/Teachers'));
// const Classes     = React.lazy(() => import('./pages/Classes'));
// const Attendance  = React.lazy(() => import('./pages/Attendance'));
// const Assignments = React.lazy(() => import('./pages/Assignments'));
// const Exams       = React.lazy(() => import('./pages/Exams'));
// const Fees        = React.lazy(() => import('./pages/Fees'));
// const Notices     = React.lazy(() => import('./pages/Notices'));
// const Timetable   = React.lazy(() => import('./pages/Timetable'));
// const NotFound    = React.lazy(() => import('./pages/NotFound'));

// const PageLoader = () => (
//   <div style={{
//     display:'flex', alignItems:'center', justifyContent:'center',
//     height:'100vh', flexDirection:'column', gap:16,
//     background:'#f8fafc', fontFamily:'Inter,sans-serif',
//   }}>
//     <div style={{
//       width:48, height:48,
//       border:'4px solid #e2e8f0',
//       borderTop:'4px solid #2563eb',
//       borderRadius:'50%',
//       animation:'spin 0.8s linear infinite',
//     }}/>
//     <span style={{ color:'#64748b', fontSize:14, fontWeight:500 }}>Loading...</span>
//     <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//   </div>
// );

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('sms_access_token');
//   return token ? children : <Navigate to="/login" replace />;
// };

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <Router>
//           <Suspense fallback={<PageLoader />}>
//             <Routes>

//               <Route path="/"      element={<Navigate to="/login" replace />} />
//               <Route path="/login" element={<Login />} />

//               <Route path="/" element={
//                 <ProtectedRoute>
//                   <Layout />
//                 </ProtectedRoute>
//               }>
//                 <Route path="dashboard"   element={<Dashboard />}   />
//                 <Route path="students"    element={<Students />}    />
//                 <Route path="teachers"    element={<Teachers />}    />
//                 <Route path="classes"     element={<Classes />}     />
//                 <Route path="attendance"  element={<Attendance />}  />
//                 <Route path="assignments" element={<Assignments />} />
//                 <Route path="exams"       element={<Exams />}       />
//                 <Route path="fees"        element={<Fees />}        />
//                 <Route path="notices"     element={<Notices />}     />
//                 <Route path="timetable"   element={<Timetable />}   />
//               </Route>

//               <Route path="*" element={<NotFound />} />

//             </Routes>
//           </Suspense>
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;


// src/App.jsx
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider  from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';
import Layout        from './components/layout/Layout';

const Login       = React.lazy(() => import('./pages/Login'));
const Dashboard   = React.lazy(() => import('./pages/Dashboard'));
const Students    = React.lazy(() => import('./pages/Students'));
const Teachers    = React.lazy(() => import('./pages/Teachers'));
const Classes     = React.lazy(() => import('./pages/Classes'));
const Attendance  = React.lazy(() => import('./pages/Attendance'));
const Assignments = React.lazy(() => import('./pages/Assignments'));
const Exams       = React.lazy(() => import('./pages/Exams'));
const Fees        = React.lazy(() => import('./pages/Fees'));
const Notices     = React.lazy(() => import('./pages/Notices'));
const Timetable   = React.lazy(() => import('./pages/Timetable'));
const NotFound    = React.lazy(() => import('./pages/NotFound'));

// --- ADDED: Super Admin Page Imports ---
const AdminStats          = React.lazy(() => import('./components/admin/AdminStats'));
const SchoolList          = React.lazy(() => import('./components/admin/SchoolList'));
const SchoolSubscription  = React.lazy(() => import('./components/admin/SchoolSubscription'));
const UserList            = React.lazy(() => import('./components/admin/UserList'));
const ActivityLogs        = React.lazy(() => import('./components/admin/ActivityLogs'));
const SystemSettings      = React.lazy(() => import('./components/admin/SystemSettings'));
// ---------------------------------------

const PageLoader = () => (
  <div style={{
    display:'flex', alignItems:'center', justifyContent:'center',
    height:'100vh', flexDirection:'column', gap:16,
    background:'#f8fafc', fontFamily:'Inter,sans-serif',
  }}>
    <div style={{
      width:48, height:48,
      border:'4px solid #e2e8f0',
      borderTop:'4px solid #2563eb',
      borderRadius:'50%',
      animation:'spin 0.8s linear infinite',
    }}/>
    <span style={{ color:'#64748b', fontSize:14, fontWeight:500 }}>Loading...</span>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('sms_access_token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>

              <Route path="/"      element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="dashboard"   element={<Dashboard />}   />
                <Route path="students"    element={<Students />}    />
                <Route path="teachers"    element={<Teachers />}    />
                <Route path="classes"     element={<Classes />}     />
                <Route path="attendance"  element={<Attendance />}  />
                <Route path="assignments" element={<Assignments />} />
                <Route path="exams"       element={<Exams />}       />
                <Route path="fees"        element={<Fees />}        />
                <Route path="notices"     element={<Notices />}     />
                <Route path="timetable"   element={<Timetable />}   />
                
                {/* --- ADDED: Super Admin Routes --- */}
                <Route path="admin/stats"          element={<AdminStats />}         />
                <Route path="admin/schools"        element={<SchoolList />}         />
                <Route path="admin/subscriptions"  element={<SchoolSubscription />} />
                <Route path="admin/users"          element={<UserList />}           />
                <Route path="admin/logs"           element={<ActivityLogs />}       />
                <Route path="admin/settings"       element={<SystemSettings />}     />
                {/* --------------------------------- */}

              </Route>

              <Route path="*" element={<NotFound />} />

            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;