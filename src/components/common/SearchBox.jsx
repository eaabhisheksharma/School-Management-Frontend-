import React, { useState } from 'react';
const SearchBox = ({ onSearch, placeholder='Search...', value='', onChange }) => {
  const [q, setQ] = useState(value);
  const handle = (e) => {
    setQ(e.target.value);
    onChange?.(e.target.value);
    onSearch?.(e.target.value);
  };
  return (
    <div className="search-input-wrap">
      <span className="search-icon">🔍</span>
      <input className="form-input" placeholder={placeholder} value={q} onChange={handle} />
      {q && <button className="search-clear" onClick={()=>{ setQ(''); onSearch?.(''); }}>✕</button>}
    </div>
  );
};
export default SearchBox;
