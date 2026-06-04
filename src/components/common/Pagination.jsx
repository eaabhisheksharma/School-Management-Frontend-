import React from 'react';
const Pagination = ({ currentPage=1, totalPages=1, onPageChange, pageSize=15, total=0 }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {((currentPage-1)*pageSize)+1}–{Math.min(currentPage*pageSize, total)} of {total}
      </span>
      <div className="pagination-pages">
        <button className="page-btn" disabled={currentPage===1} onClick={()=>onPageChange(currentPage-1)}>‹</button>
        {pages.map(p=>(
          <button key={p} className={`page-btn ${p===currentPage?'active':''}`} onClick={()=>onPageChange(p)}>{p}</button>
        ))}
        <button className="page-btn" disabled={currentPage===totalPages} onClick={()=>onPageChange(currentPage+1)}>›</button>
      </div>
    </div>
  );
};
export default Pagination;
