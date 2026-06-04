import React from 'react';
const Loading = ({ text = 'Loading...' }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
    padding:48, gap:12, flexDirection:'column' }}>
    <div className="spinner spinner-md" />
    <span style={{ color:'#64748b', fontSize:14 }}>{text}</span>
  </div>
);
export default Loading;
