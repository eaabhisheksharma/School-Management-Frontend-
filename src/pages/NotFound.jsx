import React from 'react';
const NotFound = () => (
  <div style={{ textAlign:'center', padding:'80px 20px', fontFamily:'Inter,sans-serif' }}>
    <div style={{ fontSize:72 }}>404</div>
    <h2 style={{ fontSize:24, color:'#0f172a' }}>Page Not Found</h2>
    <p style={{ color:'#64748b' }}>The page you're looking for doesn't exist.</p>
    <button onClick={() => { window.location.hash = '/dashboard'; }}
      style={{ marginTop:16, padding:'10px 24px', background:'#2563eb',
        color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700 }}>
      Go to Dashboard
    </button>
  </div>
);
export default NotFound;
