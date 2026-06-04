import React from 'react';
const Alert = ({ type='info', message, children, onClose }) => {
  const types = {
    info   :'alert-info',
    success:'alert-success',
    warning:'alert-warning',
    error  :'alert-error',
  };
  return (
    <div className={`alert ${types[type] || 'alert-info'}`}>
      <span className="alert-content">{message || children}</span>
      {onClose && <button className="alert-close" onClick={onClose}>✕</button>}
    </div>
  );
};
export default Alert;
