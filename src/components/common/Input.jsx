import React from 'react';
const Input = React.forwardRef(({ label, error, hint, required, className='', ...props }, ref) => (
  <div className="form-group">
    {label && <label className="form-label">{label}{required && <span className="required">*</span>}</label>}
    <input ref={ref} className={`form-input ${error ? 'is-error' : ''} ${className}`} {...props} />
    {error && <span className="form-error">{error}</span>}
    {hint  && <span className="form-hint">{hint}</span>}
  </div>
));
Input.displayName = 'Input';
export default Input;
