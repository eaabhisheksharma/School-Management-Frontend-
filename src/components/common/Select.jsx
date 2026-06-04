import React from 'react';
const Select = React.forwardRef(({ label, error, hint, required, options=[], className='', ...props }, ref) => (
  <div className="form-group">
    {label && <label className="form-label">{label}{required && <span className="required">*</span>}</label>}
    <select ref={ref} className={`form-input form-select ${error ? 'is-error' : ''} ${className}`} {...props}>
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
    {error && <span className="form-error">{error}</span>}
    {hint  && <span className="form-hint">{hint}</span>}
  </div>
));
Select.displayName = 'Select';
export default Select;
