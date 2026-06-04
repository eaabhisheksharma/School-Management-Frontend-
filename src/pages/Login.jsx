// import React, { useState, useEffect } from 'react';
// // FIX: Use Default Import (no curly braces)
// import { useAuth } from '../hooks/useAuth';

// const Login = () => {
//   // Destructure loginUser, superAdminLogin, etc. from the hook
//   const { loginUser, superAdminLogin, loading: authLoading, error, isAuthenticated, clearError } = useAuth();

//   const [formData, setFormData] = useState({
//     email    : '',
//     password : '',
//     role     : 'principal',
//     remember : true,
//   });
//   const [showPass,    setShowPass]    = useState(false);
//   const [localError,  setLocalError]  = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});

//   useEffect(() => {
//     if (isAuthenticated) window.location.href = '/dashboard';
//   }, [isAuthenticated]);

//   useEffect(() => {
//     if (error) setLocalError(error);
//   }, [error]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
//     if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: '' }));
//     setLocalError('');
//     if (typeof clearError === 'function') clearError();
//   };

//   const validate = () => {
//     const e = {};
//     if (!formData.email.trim()) e.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
//     if (!formData.password.trim()) e.password = 'Password is required';
//     else if (formData.password.length < 4) e.password = 'Password too short';
//     setFieldErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLocalError('');
//     try {
//       let userData;
      
//       // Logic to decide which API to call based on role
//       if (formData.role === 'superadmin') {
//         if (!superAdminLogin) {
//           setLocalError('Super Admin functionality not configured in AuthContext.');
//           return;
//         }
//         userData = await superAdminLogin({
//           email    : formData.email,
//           password : formData.password,
//         });
//       } else {
//         userData = await loginUser({
//           email    : formData.email,
//           password : formData.password,
//           role     : formData.role,
//         });
//       }

//       if (userData) window.location.href = '/dashboard';
      
//     } catch (err) {
//       setLocalError(
//         err?.response?.data?.message || 'Login failed. Check your credentials.'
//       );
//     }
//   };

//   // Added Super Admin to the roles list
//   const ROLES = [
//     { value: 'principal',  label: '🏫 Principal',  color: '#854d0e', bg: '#fef9c3' },
//     { value: 'teacher',    label: '👨‍🏫 Teacher',    color: '#1d4ed8', bg: '#eff6ff' },
//     { value: 'student',    label: '🎒 Student',     color: '#166534', bg: '#dcfce7' },
//     { value: 'parent',     label: '👨‍👩‍👧 Parent',     color: '#5b21b6', bg: '#f5f3ff' },
//     { value: 'accountant', label: '💰 Accountant',  color: '#9a3412', bg: '#fff7ed' },
//     { value: 'superadmin', label: '🛡️ Super Admin', color: '#be123c', bg: '#fff1f2' },
//   ];

//   const inp = {
//     width: '100%', padding: '11px 14px',
//     border: '1.5px solid #e2e8f0', borderRadius: 10,
//     fontSize: 14, outline: 'none',
//     background: 'white', boxSizing: 'border-box',
//     transition: 'border-color 0.2s',
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1e293b 100%)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       padding: 16, position: 'relative', overflow: 'hidden',
//     }}>

//       {/* Background circles */}
//       {[
//         { size: 320, top: -80,   left: -80,  opacity: 0.06 },
//         { size: 240, top: '60%', right: -60, opacity: 0.06 },
//         { size: 160, top: '30%', left: '60%',opacity: 0.04 },
//       ].map((c, i) => (
//         <div key={i} style={{
//           position: 'absolute',
//           width: c.size, height: c.size, borderRadius: '50%',
//           background: 'white', opacity: c.opacity,
//           top: c.top, left: c.left, right: c.right,
//         }} />
//       ))}

//       <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>

//         {/* Logo / Heading */}
//         <div style={{ textAlign: 'center', marginBottom: 32 }}>
//           <div style={{
//             width: 72, height: 72, borderRadius: 20,
//             background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: 32, margin: '0 auto 16px',
//             boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
//           }}>
//             🏫
//           </div>
//           <h1 style={{ color: 'white', margin: '0 0 6px', fontSize: 26, fontWeight: 800 }}>
//             School Management
//           </h1>
//           <p style={{ color: '#93c5fd', margin: 0, fontSize: 14 }}>
//             Sign in to your account
//           </p>
//         </div>

//         {/* Card */}
//         <div style={{
//           background: 'white', borderRadius: 20, padding: 32,
//           boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
//         }}>

//           {/* Error Banner */}
//           {localError && (
//             <div style={{
//               background: '#fff1f2', border: '1px solid #fecdd3',
//               borderRadius: 10, padding: '12px 16px', marginBottom: 20,
//               display: 'flex', alignItems: 'center', gap: 10,
//             }}>
//               <span style={{ fontSize: 18 }}>⚠️</span>
//               <span style={{ color: '#be123c', fontSize: 14, fontWeight: 500 }}>
//                 {localError}
//               </span>
//               <button
//                 onClick={() => { setLocalError(''); if (typeof clearError === 'function') clearError(); }}
//                 style={{
//                   marginLeft: 'auto', background: 'none', border: 'none',
//                   cursor: 'pointer', color: '#be123c', fontSize: 16, lineHeight: 1,
//                 }}
//               >×</button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>

//             {/* Role Selector */}
//             <div style={{ marginBottom: 20 }}>
//               <label style={{
//                 display: 'block', fontSize: 13, fontWeight: 700,
//                 color: '#374151', marginBottom: 10,
//               }}>
//                 Login As
//               </label>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
//                 {ROLES.map(({ value, label, color, bg }) => (
//                   <label key={value} style={{ cursor: 'pointer' }}>
//                     <input
//                       type="radio" name="role" value={value}
//                       checked={formData.role === value}
//                       onChange={handleChange}
//                       style={{ display: 'none' }}
//                     />
//                     <div style={{
//                       padding: '8px 4px', borderRadius: 10, textAlign: 'center',
//                       border: `2px solid ${formData.role === value ? color : '#e2e8f0'}`,
//                       background: formData.role === value ? bg : 'white',
//                       fontSize: 10,
//                       fontWeight: formData.role === value ? 800 : 500,
//                       color: formData.role === value ? color : '#94a3b8',
//                       transition: 'all 0.15s', lineHeight: 1.4,
//                     }}>
//                       {label.split(' ').map((w, i) => (
//                         <div key={i}>{w}</div>
//                       ))}
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Email */}
//             <div style={{ marginBottom: 16 }}>
//               <label style={{
//                 display: 'block', fontSize: 13, fontWeight: 700,
//                 color: '#374151', marginBottom: 6,
//               }}>
//                 Email Address
//               </label>
//               <input
//                 type="email" name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="your@email.com"
//                 autoComplete="email"
//                 style={{ ...inp, borderColor: fieldErrors.email ? '#f87171' : '#e2e8f0' }}
//                 onFocus={(e) => { if (!fieldErrors.email) e.target.style.borderColor = '#2563eb'; }}
//                 onBlur={(e)  => { e.target.style.borderColor = fieldErrors.email ? '#f87171' : '#e2e8f0'; }}
//               />
//               {fieldErrors.email && (
//                 <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
//                   {fieldErrors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div style={{ marginBottom: 16 }}>
//               <label style={{
//                 display: 'block', fontSize: 13, fontWeight: 700,
//                 color: '#374151', marginBottom: 6,
//               }}>
//                 Password
//               </label>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type={showPass ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   autoComplete="current-password"
//                   style={{
//                     ...inp,
//                     borderColor: fieldErrors.password ? '#f87171' : '#e2e8f0',
//                     paddingRight: 44,
//                   }}
//                   onFocus={(e) => { if (!fieldErrors.password) e.target.style.borderColor = '#2563eb'; }}
//                   onBlur={(e)  => { e.target.style.borderColor = fieldErrors.password ? '#f87171' : '#e2e8f0'; }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPass((p) => !p)}
//                   style={{
//                     position: 'absolute', right: 12, top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'none', border: 'none',
//                     cursor: 'pointer', fontSize: 16,
//                   }}
//                 >
//                   {showPass ? '🙈' : '👁️'}
//                 </button>
//               </div>
//               {fieldErrors.password && (
//                 <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
//                   {fieldErrors.password}
//                 </p>
//               )}
//             </div>

//             {/* Remember Me */}
//             <div style={{
//               display: 'flex', justifyContent: 'space-between',
//               alignItems: 'center', marginBottom: 24,
//             }}>
//               <label style={{
//                 display: 'flex', alignItems: 'center', gap: 8,
//                 cursor: 'pointer', fontSize: 13, color: '#475569',
//               }}>
//                 <div
//                   onClick={() => setFormData((p) => ({ ...p, remember: !p.remember }))}
//                   style={{
//                     width: 18, height: 18, borderRadius: 5,
//                     background: formData.remember ? '#2563eb' : 'white',
//                     border: `2px solid ${formData.remember ? '#2563eb' : '#d1d5db'}`,
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     cursor: 'pointer', flexShrink: 0,
//                   }}
//                 >
//                   {formData.remember && (
//                     <span style={{ color: 'white', fontSize: 11, fontWeight: 800 }}>✓</span>
//                   )}
//                 </div>
//                 Remember me
//               </label>
//               <button type="button" style={{
//                 background: 'none', border: 'none', color: '#2563eb',
//                 fontSize: 13, cursor: 'pointer', fontWeight: 600,
//               }}>
//                 Forgot password?
//               </button>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={authLoading}
//               style={{
//                 width: '100%', padding: '13px',
//                 background: authLoading
//                   ? '#93c5fd'
//                   : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//                 color: 'white', border: 'none', borderRadius: 12,
//                 fontSize: 15, fontWeight: 800,
//                 cursor: authLoading ? 'not-allowed' : 'pointer',
//                 boxShadow: authLoading ? 'none' : '0 4px 14px rgba(37,99,235,0.4)',
//                 display: 'flex', alignItems: 'center',
//                 justifyContent: 'center', gap: 8,
//                 transition: 'all 0.2s',
//               }}
//             >
//               {authLoading ? (
//                 <>
//                   <div style={{
//                     width: 18, height: 18, borderRadius: '50%',
//                     border: '2px solid rgba(255,255,255,0.4)',
//                     borderTopColor: 'white',
//                     animation: 'spin 0.7s linear infinite',
//                   }} />
//                   Signing in...
//                 </>
//               ) : (
//                 '🔐 Sign In'
//               )}
//             </button>
//           </form>

//           {/* Demo Credentials */}
//           <div style={{
//             marginTop: 24, padding: 14, borderRadius: 10,
//             background: '#f0f9ff', border: '1px solid #bae6fd',
//           }}>
//             <div style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', marginBottom: 8 }}>
//               🧪 Demo Credentials
//             </div>
//             {[
//               { role: 'Principal', email: 'principal@school.com', pass: 'admin123' },
//               { role: 'Teacher',   email: 'teacher@school.com',   pass: 'teach123' },
//               { role: 'Super Admin', email: 'superadmin@school.com', pass: 'super123' },
//             ].map(({ role, email, pass }) => (
//               <div
//                 key={role}
//                 onClick={() => setFormData((p) => ({
//                   ...p, email, password: pass, role: role.toLowerCase().replace(' ', ''),
//                 }))}
//                 style={{
//                   display: 'flex', justifyContent: 'space-between',
//                   alignItems: 'center', padding: '6px 10px',
//                   borderRadius: 7, cursor: 'pointer', marginBottom: 4,
//                   transition: 'background 0.15s',
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
//                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//               >
//                 <span style={{ fontSize: 12, fontWeight: 700, color: '#0369a1' }}>{role}</span>
//                 <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
//                   {email}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20 }}>
//           © {new Date().getFullYear()} School Management System
//         </p>
//       </div>

//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default Login;

// // Code Change 



// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../hooks/useAuth';

// const Login = () => {
//   // Destructure loginUser, superAdminLogin, etc. from the hook
//   const { loginUser, superAdminLogin, loading: authLoading, error, isAuthenticated, clearError } = useAuth();

//   const [formData, setFormData] = useState({
//     email    : '',
//     password : '',
//     role     : 'principal',
//     remember : true,
//   });
//   const [showPass,    setShowPass]    = useState(false);
//   const [localError,  setLocalError]  = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});

//   useEffect(() => {
//     if (isAuthenticated) window.location.href = '/dashboard';
//   }, [isAuthenticated]);

//   useEffect(() => {
//     if (error) setLocalError(error);
//   }, [error]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
//     if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: '' }));
//     setLocalError('');
//     if (typeof clearError === 'function') clearError();
//   };

//   const validate = () => {
//     const e = {};
//     if (!formData.email.trim()) e.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
//     if (!formData.password.trim()) e.password = 'Password is required';
//     else if (formData.password.length < 4) e.password = 'Password too short';
//     setFieldErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLocalError('');
//     try {
//       let userData;
      
//       // Logic to decide which API to call based on role
//       if (formData.role === 'superadmin') {
//         if (!superAdminLogin) {
//           setLocalError('Super Admin functionality not configured.');
//           return;
//         }
//         userData = await superAdminLogin({
//           email    : formData.email,
//           password : formData.password,
//         });
//       } else {
//         userData = await loginUser({
//           email    : formData.email,
//           password : formData.password,
//           role     : formData.role,
//         });
//       }

//       // Hard redirect to dashboard to refresh state
//       if (userData) window.location.href = '/dashboard';
      
//     } catch (err) {
//       const message = err?.response?.data?.error || err?.message || 'Login failed. Check your credentials.';
//       setLocalError(message);
//     }
//   };

//   // Roles List
//   const ROLES = [
//     { value: 'principal',  label: '🏫 Principal',  color: '#854d0e', bg: '#fef9c3' },
//     { value: 'teacher',    label: '👨‍🏫 Teacher',    color: '#1d4ed8', bg: '#eff6ff' },
//     { value: 'student',    label: '🎒 Student',     color: '#166534', bg: '#dcfce7' },
//     { value: 'parent',     label: '👨‍👩‍👧 Parent',     color: '#5b21b6', bg: '#f5f3ff' },
//     { value: 'accountant', label: '💰 Accountant',  color: '#9a3412', bg: '#fff7ed' },
//     { value: 'superadmin', label: '🛡️ Super Admin', color: '#be123c', bg: '#fff1f2' },
//   ];

//   const inp = {
//     width: '100%', padding: '11px 14px',
//     border: '1.5px solid #e2e8f0', borderRadius: 10,
//     fontSize: 14, outline: 'none',
//     background: 'white', boxSizing: 'border-box',
//     transition: 'border-color 0.2s',
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1e293b 100%)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       padding: 16, position: 'relative', overflow: 'hidden',
//     }}>

//       {/* Background circles */}
//       {[
//         { size: 320, top: -80,   left: -80,  opacity: 0.06 },
//         { size: 240, top: '60%', right: -60, opacity: 0.06 },
//         { size: 160, top: '30%', left: '60%',opacity: 0.04 },
//       ].map((c, i) => (
//         <div key={i} style={{
//           position: 'absolute',
//           width: c.size, height: c.size, borderRadius: '50%',
//           background: 'white', opacity: c.opacity,
//           top: c.top, left: c.left, right: c.right,
//         }} />
//       ))}

//       <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>

//         {/* Logo / Heading */}
//         <div style={{ textAlign: 'center', marginBottom: 32 }}>
//           <div style={{
//             width: 72, height: 72, borderRadius: 20,
//             background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: 32, margin: '0 auto 16px',
//             boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
//           }}>
//             🏫
//           </div>
//           <h1 style={{ color: 'white', margin: '0 0 6px', fontSize: 26, fontWeight: 800 }}>
//             School Management
//           </h1>
//           <p style={{ color: '#93c5fd', margin: 0, fontSize: 14 }}>
//             Sign in to your account
//           </p>
//         </div>

//         {/* Card */}
//         <div style={{
//           background: 'white', borderRadius: 20, padding: 32,
//           boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
//         }}>

//           {/* Error Banner */}
//           {localError && (
//             <div style={{
//               background: '#fff1f2', border: '1px solid #fecdd3',
//               borderRadius: 10, padding: '12px 16px', marginBottom: 20,
//               display: 'flex', alignItems: 'center', gap: 10,
//             }}>
//               <span style={{ fontSize: 18 }}>⚠️</span>
//               <span style={{ color: '#be123c', fontSize: 14, fontWeight: 500 }}>
//                 {localError}
//               </span>
//               <button
//                 onClick={() => { setLocalError(''); if (typeof clearError === 'function') clearError(); }}
//                 style={{
//                   marginLeft: 'auto', background: 'none', border: 'none',
//                   cursor: 'pointer', color: '#be123c', fontSize: 16, lineHeight: 1,
//                 }}
//               >×</button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>

//             {/* Role Selector */}
//             <div style={{ marginBottom: 20 }}>
//               <label style={{
//                 display: 'block', fontSize: 13, fontWeight: 700,
//                 color: '#374151', marginBottom: 10,
//               }}>
//                 Login As
//               </label>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
//                 {ROLES.map(({ value, label, color, bg }) => (
//                   <label key={value} style={{ cursor: 'pointer' }}>
//                     <input
//                       type="radio" name="role" value={value}
//                       checked={formData.role === value}
//                       onChange={handleChange}
//                       style={{ display: 'none' }}
//                     />
//                     <div style={{
//                       padding: '8px 4px', borderRadius: 10, textAlign: 'center',
//                       border: `2px solid ${formData.role === value ? color : '#e2e8f0'}`,
//                       background: formData.role === value ? bg : 'white',
//                       fontSize: 10,
//                       fontWeight: formData.role === value ? 800 : 500,
//                       color: formData.role === value ? color : '#94a3b8',
//                       transition: 'all 0.15s', lineHeight: 1.4,
//                     }}>
//                       {label.split(' ').map((w, i) => (
//                         <div key={i}>{w}</div>
//                       ))}
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Email */}
//             <div style={{ marginBottom: 16 }}>
//               <label style={{
//                 display: 'block', fontSize: 13, fontWeight: 700,
//                 color: '#374151', marginBottom: 6,
//               }}>
//                 Email Address
//               </label>
//               <input
//                 type="email" name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="your@email.com"
//                 autoComplete="email"
//                 style={{ ...inp, borderColor: fieldErrors.email ? '#f87171' : '#e2e8f0' }}
//                 onFocus={(e) => { if (!fieldErrors.email) e.target.style.borderColor = '#2563eb'; }}
//                 onBlur={(e)  => { e.target.style.borderColor = fieldErrors.email ? '#f87171' : '#e2e8f0'; }}
//               />
//               {fieldErrors.email && (
//                 <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
//                   {fieldErrors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div style={{ marginBottom: 16 }}>
//               <label style={{
//                 display: 'block', fontSize: 13, fontWeight: 700,
//                 color: '#374151', marginBottom: 6,
//               }}>
//                 Password
//               </label>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type={showPass ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   autoComplete="current-password"
//                   style={{
//                     ...inp,
//                     borderColor: fieldErrors.password ? '#f87171' : '#e2e8f0',
//                     paddingRight: 44,
//                   }}
//                   onFocus={(e) => { if (!fieldErrors.password) e.target.style.borderColor = '#2563eb'; }}
//                   onBlur={(e)  => { e.target.style.borderColor = fieldErrors.password ? '#f87171' : '#e2e8f0'; }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPass((p) => !p)}
//                   style={{
//                     position: 'absolute', right: 12, top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'none', border: 'none',
//                     cursor: 'pointer', fontSize: 16,
//                   }}
//                 >
//                   {showPass ? '🙈' : '👁️'}
//                 </button>
//               </div>
//               {fieldErrors.password && (
//                 <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
//                   {fieldErrors.password}
//                 </p>
//               )}
//             </div>

//             {/* Remember Me */}
//             <div style={{
//               display: 'flex', justifyContent: 'space-between',
//               alignItems: 'center', marginBottom: 24,
//             }}>
//               <label style={{
//                 display: 'flex', alignItems: 'center', gap: 8,
//                 cursor: 'pointer', fontSize: 13, color: '#475569',
//               }}>
//                 <div
//                   onClick={() => setFormData((p) => ({ ...p, remember: !p.remember }))}
//                   style={{
//                     width: 18, height: 18, borderRadius: 5,
//                     background: formData.remember ? '#2563eb' : 'white',
//                     border: `2px solid ${formData.remember ? '#2563eb' : '#d1d5db'}`,
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     cursor: 'pointer', flexShrink: 0,
//                   }}
//                 >
//                   {formData.remember && (
//                     <span style={{ color: 'white', fontSize: 11, fontWeight: 800 }}>✓</span>
//                   )}
//                 </div>
//                 Remember me
//               </label>
//               <button type="button" style={{
//                 background: 'none', border: 'none', color: '#2563eb',
//                 fontSize: 13, cursor: 'pointer', fontWeight: 600,
//               }}>
//                 Forgot password?
//               </button>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={authLoading}
//               style={{
//                 width: '100%', padding: '13px',
//                 background: authLoading
//                   ? '#93c5fd'
//                   : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//                 color: 'white', border: 'none', borderRadius: 12,
//                 fontSize: 15, fontWeight: 800,
//                 cursor: authLoading ? 'not-allowed' : 'pointer',
//                 boxShadow: authLoading ? 'none' : '0 4px 14px rgba(37,99,235,0.4)',
//                 display: 'flex', alignItems: 'center',
//                 justifyContent: 'center', gap: 8,
//                 transition: 'all 0.2s',
//               }}
//             >
//               {authLoading ? (
//                 <>
//                   <div style={{
//                     width: 18, height: 18, borderRadius: '50%',
//                     border: '2px solid rgba(255,255,255,0.4)',
//                     borderTopColor: 'white',
//                     animation: 'spin 0.7s linear infinite',
//                   }} />
//                   Signing in...
//                 </>
//               ) : (
//                 '🔐 Sign In'
//               )}
//             </button>
//           </form>

//           {/* Demo Credentials */}
//           <div style={{
//             marginTop: 24, padding: 14, borderRadius: 10,
//             background: '#f0f9ff', border: '1px solid #bae6fd',
//           }}>
//             <div style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', marginBottom: 8 }}>
//               🧪 Demo Credentials
//             </div>
//             {[
//               { role: 'Principal', email: 'principal@school.com', pass: 'admin123' },
//               { role: 'Teacher',   email: 'teacher@school.com',   pass: 'teach123' },
//               // Updated to match your backend logs exactly
//               { role: 'Super Admin', email: 'superadmin@yoursaas.com', pass: 'SuperAdmin@123' },
//             ].map(({ role, email, pass }) => (
//               <div
//                 key={role}
//                 onClick={() => setFormData((p) => ({
//                   ...p, email, password: pass, role: role.toLowerCase().replace(' ', ''),
//                 }))}
//                 style={{
//                   display: 'flex', justifyContent: 'space-between',
//                   alignItems: 'center', padding: '6px 10px',
//                   borderRadius: 7, cursor: 'pointer', marginBottom: 4,
//                   transition: 'background 0.15s',
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
//                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//               >
//                 <span style={{ fontSize: 12, fontWeight: 700, color: '#0369a1' }}>{role}</span>
//                 <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
//                   {email}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20 }}>
//           © {new Date().getFullYear()} School Management System
//         </p>
//       </div>

//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default Login;





import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  // Destructure loginUser, superAdminLogin, etc. from the hook
  const { loginUser, superAdminLogin, loading: authLoading, error, isAuthenticated, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email    : '',
    password : '',
    role     : 'principal',
    remember : true,
  });
  const [showPass,    setShowPass]    = useState(false);
  const [localError,  setLocalError]  = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting]   = useState(false);

  // Effect to redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // FIX: Use hash for routing consistency
      window.location.hash = '/dashboard';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: '' }));
    setLocalError('');
    if (typeof clearError === 'function') clearError();
  };

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
    if (!formData.password.trim()) e.password = 'Password is required';
    else if (formData.password.length < 4) e.password = 'Password too short';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLocalError('');
    setSubmitting(true);
    try {
      let userData;

      if (formData.role === 'superadmin') {
        userData = await superAdminLogin({
          email    : formData.email,
          password : formData.password,
        });
      } else {
        userData = await loginUser({
          email    : formData.email,
          password : formData.password,
        });
      }

      if (userData) {
        window.location.hash = '/dashboard';
      }

    } catch (err) {
      const message = err?.message || 'Login failed. Check your credentials.';
      setLocalError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Roles List
  const ROLES = [
    { value: 'principal',  label: '🏫 Principal',  color: '#854d0e', bg: '#fef9c3' },
    { value: 'teacher',    label: '👨‍🏫 Teacher',    color: '#1d4ed8', bg: '#eff6ff' },
    { value: 'student',    label: '🎒 Student',     color: '#166534', bg: '#dcfce7' },
    { value: 'parent',     label: '👨‍👩‍👧 Parent',     color: '#5b21b6', bg: '#f5f3ff' },
    { value: 'accountant', label: '💰 Accountant',  color: '#9a3412', bg: '#fff7ed' },
    { value: 'superadmin', label: '🛡️ Super Admin', color: '#be123c', bg: '#fff1f2' },
  ];

  const inp = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 14, outline: 'none',
    background: 'white', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1e293b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, position: 'relative', overflow: 'hidden',
    }}>

      {/* Background circles */}
      {[
        { size: 320, top: -80,   left: -80,  opacity: 0.06 },
        { size: 240, top: '60%', right: -60, opacity: 0.06 },
        { size: 160, top: '30%', left: '60%',opacity: 0.04 },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: c.size, height: c.size, borderRadius: '50%',
          background: 'white', opacity: c.opacity,
          top: c.top, left: c.left, right: c.right,
        }} />
      ))}

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>

        {/* Logo / Heading */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
          }}>
            🏫
          </div>
          <h1 style={{ color: 'white', margin: '0 0 6px', fontSize: 26, fontWeight: 800 }}>
            School Management
          </h1>
          <p style={{ color: '#93c5fd', margin: 0, fontSize: 14 }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 32,
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        }}>

          {/* Error Banner */}
          {localError && (
            <div style={{
              background: '#fff1f2', border: '1px solid #fecdd3',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span style={{ color: '#be123c', fontSize: 14, fontWeight: 500 }}>
                {localError}
              </span>
              <button
                onClick={() => { setLocalError(''); if (typeof clearError === 'function') clearError(); }}
                style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  cursor: 'pointer', color: '#be123c', fontSize: 16, lineHeight: 1,
                }}
              >×</button>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Role Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 700,
                color: '#374151', marginBottom: 10,
              }}>
                Login As
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {ROLES.map(({ value, label, color, bg }) => (
                  <label key={value} style={{ cursor: 'pointer' }}>
                    <input
                      type="radio" name="role" value={value}
                      checked={formData.role === value}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      padding: '8px 4px', borderRadius: 10, textAlign: 'center',
                      border: `2px solid ${formData.role === value ? color : '#e2e8f0'}`,
                      background: formData.role === value ? bg : 'white',
                      fontSize: 10,
                      fontWeight: formData.role === value ? 800 : 500,
                      color: formData.role === value ? color : '#94a3b8',
                      transition: 'all 0.15s', lineHeight: 1.4,
                    }}>
                      {label.split(' ').map((w, i) => (
                        <div key={i}>{w}</div>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 700,
                color: '#374151', marginBottom: 6,
              }}>
                Email Address
              </label>
              <input
                type="email" name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                autoComplete="email"
                style={{ ...inp, borderColor: fieldErrors.email ? '#f87171' : '#e2e8f0' }}
                onFocus={(e) => { if (!fieldErrors.email) e.target.style.borderColor = '#2563eb'; }}
                onBlur={(e)  => { e.target.style.borderColor = fieldErrors.email ? '#f87171' : '#e2e8f0'; }}
              />
              {fieldErrors.email && (
                <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 700,
                color: '#374151', marginBottom: 6,
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    ...inp,
                    borderColor: fieldErrors.password ? '#f87171' : '#e2e8f0',
                    paddingRight: 44,
                  }}
                  onFocus={(e) => { if (!fieldErrors.password) e.target.style.borderColor = '#2563eb'; }}
                  onBlur={(e)  => { e.target.style.borderColor = fieldErrors.password ? '#f87171' : '#e2e8f0'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 16,
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {fieldErrors.password && (
                <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 24,
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', fontSize: 13, color: '#475569',
              }}>
                <div
                  onClick={() => setFormData((p) => ({ ...p, remember: !p.remember }))}
                  style={{
                    width: 18, height: 18, borderRadius: 5,
                    background: formData.remember ? '#2563eb' : 'white',
                    border: `2px solid ${formData.remember ? '#2563eb' : '#d1d5db'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  {formData.remember && (
                    <span style={{ color: 'white', fontSize: 11, fontWeight: 800 }}>✓</span>
                  )}
                </div>
                Remember me
              </label>
              <button type="button" style={{
                background: 'none', border: 'none', color: '#2563eb',
                fontSize: 13, cursor: 'pointer', fontWeight: 600,
              }}>
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%', padding: '13px',
                background: submitting
                  ? '#93c5fd'
                  : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color: 'white', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 800,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 4px 14px rgba(37,99,235,0.4)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
            >
              {submitting ? (
                <>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: 'white',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{
            marginTop: 24, padding: 14, borderRadius: 10,
            background: '#f0f9ff', border: '1px solid #bae6fd',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', marginBottom: 8 }}>
              🧪 Demo Credentials
            </div>
            {[
              { role: 'Super Admin', email: 'superadmin@school.com', pass: 'SuperAdmin@2024' },
            ].map(({ role, email, pass }) => (
              <div
                key={role}
                onClick={() => setFormData((p) => ({
                  ...p, email, password: pass, role: role.toLowerCase().replace(' ', ''),
                }))}
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '6px 10px',
                  borderRadius: 7, cursor: 'pointer', marginBottom: 4,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0369a1' }}>{role}</span>
                <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
                  {email}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20 }}>
          © {new Date().getFullYear()} School Management System
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;