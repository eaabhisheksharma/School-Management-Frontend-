import React from 'react';
const Badge = ({ children, type = 'primary', className = '' }) => (
  <span className={`badge badge-${type} ${className}`}>{children}</span>
);
export default Badge;
