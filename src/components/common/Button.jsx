import React from 'react';
const Button = ({ children, onClick, type='button', className='', disabled=false, ...props }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    className={`btn ${className}`} {...props}>
    {children}
  </button>
);
export default Button;
